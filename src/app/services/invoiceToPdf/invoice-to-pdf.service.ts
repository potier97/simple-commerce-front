import { Injectable } from '@angular/core'; 
import { ProductDetailsData } from '@app/models/product-details';
import { UserData } from '@app/models/user';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; 
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class InvoiceToPdfService {
   
  userAdmin: UserData;

  constructor() {} 


  getBase64ImageFromURL(url: string, type: string): Promise<string> {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx: any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(`image/${type}`);
        resolve(dataURL);
      }; 
      img.onerror = error => {
        reject(error);
      };
  
      img.src = url;
    });
  }
 


  async generatePdf(
      adminName: string,       // Nombre del admin
      customer: UserData,   // datos del cliente
      products: ProductDetailsData[],  // Lista de Productos
      facturaId: number,       //Id de la factura
      subtotal: number,        // Sub total de la factura
      tax: number,             // Iva cobrado
      discount: number,        // descuento
      total: number            // total de la factura
    ): Promise<void> { 
   
    
    //Imagenes de la tienda y calidad
    const logo: string = await this.getBase64ImageFromURL("../../../assets/image/logo-Horizontal.svg", "svg") 
    const calidad: string = await this.getBase64ImageFromURL("../../../assets/image/calidad.png", "png") 
    //Datos del cuerpo de la tabla del detalle
    const bodyTable: any[] = [];
    //Headers - Titulos de la tabla
    const bodyHeader: any[] = [ 
      {
        text: 'Producto',
        bold: true,
        margin: [ 10, 10, 0, 10 ],
        color: "#226706"
      }, 
      {
        text: 'Precio',
        bold: true,
        alignment: 'center',
        margin: [ 0, 10, 0, 10 ],
        color: "#226706"
      },
      {
        text: 'Cantidad',
        bold: true,
        alignment: 'center',
        margin: [ 0, 10, 0, 10 ],
        color: "#226706"
      },
      {
        text: 'Iva',
        bold: true,
        alignment: 'center',
        margin: [ 0, 10, 0, 10 ],
        color: "#226706"
      },
      {
        text: 'Monto',
        bold: true,
        alignment: 'center',
        margin: [ 0, 10, 0, 10 ],
        color: "#226706"
      } 
    ]
    bodyTable.push(bodyHeader)
    //Margen superior e inferior de cada celda en la tabla
    const spaceTable: number = 7; 
    //Añadiendo los datos a la tabla
    products.map((p: ProductDetailsData) => bodyTable.push( [
      {
        text: p.name,
        color: "#226706", 
        alignment: 'left',
        margin: [ 15, spaceTable, 0, spaceTable ],
      },
      {
        text: `$ ${p.precio}`,
        color: "#226706", 
        alignment: 'center',
        margin: [ 0, spaceTable, 0, spaceTable ],
      },
      {
        text: p.cantidad,
        color: "#226706", 
        alignment: 'center',
        margin: [ 0, spaceTable, 0, spaceTable ],
      },
      {
        text: `${p.iva} %`,
        color: "#226706", 
        alignment: 'center',
        margin: [ 0, spaceTable, 0, spaceTable ],
      },
      {
        text: `$ ${p.total}`,
        color: "#226706", 
        alignment: 'center',
        margin: [ 0, spaceTable, 0, spaceTable ],
      }]))

    
    //Calculando el total de la compra 
    bodyTable.push([
      { 
        text: '',   
        rowSpan: 4,  
      }, 
      {}, 
      {}, 
      {
        text: 'Subtotal',  
        alignment: 'right',
        color: "#226706",   
        margin: [ 0, spaceTable, 0, spaceTable ],
      },
      {
        text: `$ ${subtotal}`,
        alignment: 'left',
        color: "#226706",  
        margin: [ 0, spaceTable, 0, spaceTable ],
      }
    ])   
    bodyTable.push([
      {}, 
      {}, 
      {}, 
      {
        text: 'Iva',  
        alignment: 'right',
        color: "#226706",  
        margin: [ 0, spaceTable, 0, spaceTable ],
      },
      {
        text: `$ ${tax}`,
        alignment: 'left',
        color: "#226706", 
        margin: [ 0, spaceTable, 0, spaceTable ],
      }
    ])   
    bodyTable.push([
      {}, 
      {}, 
      {}, 
      {
        text: 'Descuento', 
        alignment: 'right', 
        color: "#226706",  
        margin: [ 0, spaceTable, 0, spaceTable ],
      },
      {
        text: `$ ${discount}`,
        alignment: 'left',
        color: "#226706",  
        margin: [ 0, spaceTable, 0, spaceTable ],
      }
    ])   
    bodyTable.push([
      {}, 
      {},
      {},  
      {
        text: 'Total',  
        alignment: 'right',
        color: "#226706",   
        margin: [ 0, spaceTable, 0, spaceTable ],
      },
      {
        text: `$ ${total}`,
        alignment: 'left',
        color: "#226706",  
        margin: [ 0, spaceTable, 0, spaceTable ],
      }
    ])   

    //Creando el pdf de la factura
    pdfMake.createPdf({
      //Marca de agua
      // watermark: {
      //   text: `Factura Compra ${facturaId}`, //'Factura Compra',
      //   opacity: 0.2,
      //   color: "#226706",
      //   bold: true, 
      //   italics: false
      // },
      background: [
        {
          image: logo,
          width: 450, 
          opacity: 0.15,
          absolutePosition: {
            x: 90,
            y: 350 
          } 
        }
      ],
      info: {
        title: `Factura ${facturaId}`,
        author: 'Administrador',
        subject: `Factura de Compra ${facturaId}`,
        creationDate: new Date(),
        keywords: 'Factura',
        creator: 'Doki PetSotre', 
        producer: 'Doki PetSotre', 
      },
      pageSize: 'A4', 
        
      content: [ 
        { 
          image: logo,  
          width: 200, 
          alignment: 'center',  
        },  
        {  
          text: 'Tienda de Electrodomésticos al mejor precio y calidad',   
          alignment: 'center',  
          fontSize: 16,  
          color: "#C1C164",
          margin: [ 0, 10, 0, 20]
        },  
        //Descripción de factura / cliente 
        {  
          text: 'Cliente',  
          style: 'sectionHeader',   
        },
        {  
          columns: [  
              [  
                { text: `${customer.name}  ${customer.lastName}`,  
                  style: 'sectionCustomer',
                  bold: true, 
                },  
                { text: customer.userAddress,
                  style: 'sectionCustomer',
                },  
                { text: customer.userMail,
                  style: 'sectionCustomer',
                },  
                { text: customer.userPhone,
                  style: 'sectionCustomer',
                }  
              ],  
              [  
                {  
                    text: `Factura No. ${facturaId}`,  
                    alignment: 'right', 
                    color: "#226706",  
                    margin: [ 0, 0, 0, 15 ]
                },
                {  
                  text: `Fecha: ${new Date().toLocaleString()}`,  
                  alignment: 'right', 
                  color: "#226706",  
              },   
              ]  
          ]  
        },  
        //Descripción del Administrador que registró
        {  
          text: 'Cajero',  
          style: 'sectionHeader',   
        },
        {  
          columns: [  
              [  
                { text: adminName,  
                  style: 'sectionCustomer',
                  bold: true, 
                },   
              ],   
          ]  
        },   
        //Tabla de detalle
        {  
          text: 'Detalle Compra',  
          style: 'sectionHeader'  
        },    
        {           
          table: {   
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'], 
            body: bodyTable, 
          }, 
          layout: { 
            fillColor: function (rowIndex) {
              if(rowIndex === 0) return '#226706';
              return null;
            }, 
            hLineWidth: function (i, node) {
              if (i === 0 || i === node.table.body.length) return 0;
              return (i === node.table.headerRows) ? 3 : 2;
            },
            vLineWidth: function (i) {
              return 0;
            }, 
            vLineColor: function (i) {
              return "transparent";
            },
            hLineColor: function (i) {
              return i === 1 ? "#226706" : '#C1C164';
            },
            paddingLeft: function (i) {
              return i === 0 ? 0 : 8;
            },
            paddingRight: function (i, node: any) {
              return (i === node.table.widths.length - 1) ? 0 : 8;
            },
            fillOpacity: function(rowIndex){
              if(rowIndex === 0) return 0.15;
              return 0.55;
            } 
          }

        }, 
        //Footer 
        { 
          image: calidad,  
          width: 40, 
          alignment: 'left', 
          margin: [15, 0, 0, 5 ], 
        },
        {
          text: 'Doki PetSotre ® - 2021 - Marca Registrada desde 1950', 
          bold: false, 
          color: "#226706",   
          fontSize: 8,    
        },  
      ],
      styles: {  
        sectionHeader: {  
            bold: true, 
            color: "#226706",   
            fontSize: 14,  
            margin: [0, 15, 0, 15]  
        },
        sectionCustomer: {  
          bold: false,  
          color: "#226706",  
          fontSize: 12,  
          margin: [15, 0, 0, 4]  
      } 
    }  
    }).open(); 
  }
}

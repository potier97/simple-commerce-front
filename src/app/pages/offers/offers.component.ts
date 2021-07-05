import { Component, OnInit } from '@angular/core';
import { CustomerPdf, InvoicePdf } from '@app/models/invoice-pdf';
import { InvoiceToPdfService } from '@app/services/invoiceToPdf/invoice-to-pdf.service';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  constructor(
    private pdfGenerator: InvoiceToPdfService
  ) { }

  ngOnInit(): void {
  }

  generatePdf() {
    const customerData: CustomerPdf = {
      customerName: 'Pepito Perez',
      address: 'Trv 39a 23 SUR',
      email: 'pepitoPeres@email.com',
      contactNo: '314569852'
    }
    const  productsData: InvoicePdf[] = [
      {
        name: 'Tv Samsung 32 Plgadas', 
        price: 1250000, 
        qty: 3,
        tax: 18,
        total: 3550000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  3550000/1.18 = 3008474.57
        // el valor del iva es igual a => total - valorSinIva => 3550000 - 3008474.57 = 541525.43
        //taxValue: 541525.43
      },
      {
        name: 'Usb 32 Gb', 
        price: 80000, 
        qty: 5,
        tax: 18,
        total: 400000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  400000/1.18 = 338983.05
        // el valor del iva es igual a => total - valorSinIva => 400000 - 338983.05 = 61016.95
        //taxValue: 61016.95
      },
      {
        name: 'Celular Xiamoi S9', 
        price: 950000, 
        qty: 1,
        tax: 0,
        total: 950000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  400000 (no aplica iva) = 400000
        // el valor del iva es igual a => 0
        //taxValue: 0
      },
    ]  
    
    const invoiceId = 753
    const subtotal = 4900000
    //541525.43 +  61016.95 + 0 
    const totalTax = 602542.38 
    // en el caso de que aplique un descuento del 17% a la compra
    // El Valor del descuento =>  subtotal*(descuento/100) => 4900000*0.17
    // el descuento es del => 833000
    const discount = 833000
    //El total es el subtotal menos el descuento aplicado - si no aplica, el valor de la compra es igual al del total
    const total = 4067000

    this.pdfGenerator.generatePdf(customerData, productsData, invoiceId, subtotal, totalTax, discount, total);
  }
}

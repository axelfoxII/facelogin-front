import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as faceapi from 'face-api.js';
import Swal from 'sweetalert2';
import { Imagenes } from '../../interfaces/images-interface';


const URL= environment.urlServer;

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {

  images = '';
  imgURL = '/assets/noimage.png';
  imagenes:any=[];
  btnActive=true;
  imgProcess:any=[];

  @ViewChild('imagesList',{static:true}) imagesList!: ElementRef;

  constructor(private http:HttpClient, private router:Router, private renderer: Renderer2) { }

  ngOnInit(){
    this.mostrarImg();
  }


  selectImage(event:any){
    
   if (event.target.files.length >0) {
    
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event:any)=>{
  
      this.imgURL = event.target.result;

    }

    this.images = file;
    this.btnActive = false;

   }

  }

  processFace = async(image:any,imageContainer:any, id:string) => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models')
    await faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models')
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models')

    const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()
    console.log(detection)
    if (typeof detection === 'undefined') {
      imageContainer.querySelector('.status').innerText = 'No se puede procesar';
        return;
    }else{
      imageContainer.querySelector('.status').innerText = 'Procesado';
    }

  
   
}


  mostrarImg(){

    this.http.get<any>(`${URL}/upload`).subscribe((res:Imagenes)=>{
      
      this.imagenes = res;

      this.imagenes.forEach(async(imagen:any)=>{

        var imageContainer = document.createElement('div');
        var deleteLink = document.createElement('a');
        var imageElement = document.createElement('img');
        var status = document.createElement('div');
        var icon = document.createElement('i');

        icon.classList.add('fas');
        icon.classList.add('fa-3x');
        icon.classList.add('fa-spinner');
        icon.classList.add('fa-pulse');

        
        imageContainer.classList.add('imageContainer');
        deleteLink.classList.add('cerrar');
        imageElement.classList.add('card-img-top');
        imageElement.classList.add('imageElement');
        imageElement.src= `${URL}/${imagen.imagen}`;
        imageElement.crossOrigin = 'anonymous';
        deleteLink.innerText = 'X';
        status.classList.add('status');

        this.imgProcess = imageElement;

        status.appendChild(icon);
        imageContainer.appendChild(deleteLink);
        imageContainer.appendChild(status)
        imageContainer.appendChild(imageElement);


        deleteLink.addEventListener('click', e =>{
          
          e.preventDefault();
          this.deleteImg(imagen.id);

        })


        this.renderer.appendChild(this.imagesList.nativeElement, imageContainer);
    
        this.processFace(this.imgProcess,imageContainer, imagen.id);
      })


    });



  }


  onSubmit(){
    
    Swal.fire({
  
      title: 'Introducir Password',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',

    }).then((result)=>{
        
      if (result.isConfirmed && result.value) {
        
        let formData = new FormData();

        formData.append('file', this.images);
        formData.append('password', result.value);

        this.http.post<any>(`${URL}/file`, formData).subscribe(

          res =>{ Swal.fire({
                
            icon:'success',
            title: 'Imagen Cargada',
            text:'La imagen se subio correctamente'
          }).then(()=>{
              
            if (result) {
              location.reload();
            }

          })      


          }

        );

        
        
      }else{
        
        Swal.fire('Error', 'Debe llenar el password', 'error');

      }


    })


  }


  deleteImg(id:string){
  
    Swal.fire({
      icon:'info',
      title:'Desea Eliminar esta imagen?',
      confirmButtonText: 'Eliminar'
    }).then((result) =>{

      if (result.isConfirmed) {

        this.http.delete<any>(`${URL}/delete/${id}`).subscribe(res=>{ Swal
          
          location.reload();
        
        })
        
      }

    })


  }


  logout(){

  }


}

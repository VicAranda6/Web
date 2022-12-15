import { Component, OnInit } from "@angular/core"
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms"
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{

  form: FormGroup
  imagePreview: string
  private mode = 'create'
  private postId: string
  post: Post
  isLoading = false
  disability = 'No'
  reports = 'No'

  constructor(public postsService: PostService, public route: ActivatedRoute){ }

  ngOnInit(){

    this.form = new FormGroup({
      "nombre": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "apellido": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "fecha": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "address": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]}),
      "number": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "area": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "nivel": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]}),
      "social": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]}),
      "estado": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]}),
      "image": new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]})
    })

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true
        //this.post = this.postsService.getPost(this.postId)
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false
          this.post = {
            id: postData._id,
            nombre: postData.nombre,
            apellido: postData.apellido,
            fecha: postData.fecha,
            address: postData.address,
            number: postData.number,
            area: postData.area,
            nivel: postData.nivel,
            social: postData.social,
            estado: postData.estado,
            imagePath: postData.imagePath
          }
          this.form.setValue({
            nombre: this.post.nombre,
            apellido: this.post.apellido,
            fecha: this.post.fecha,
            address: this.post.address,
            number: this.post.number,
            area: this.post.area,
            nivel: this.post.nivel,
            social: this.post.social,
            estado: this.post.estado,
            image: this.post.imagePath
          })
        })
      }else{
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({image: file})
    this.form.get('image').updateValueAndValidity()
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
    console.log(file)
    console.log(this.form)
  }

  onSavePost(){
    if(this.form.invalid){
      return
    }
    this.isLoading = true
    if(this.mode == 'create'){
      this.postsService.addPost(
        this.form.value.nombre,
        this.form.value.apellido,
        this.form.value.fecha,
        this.form.value.address,
        this.form.value.number,
        this.form.value.area,
        this.form.value.nivel,
        this.form.value.social,
        this.form.value.estado,
        this.form.value.image
        )

    }else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.nombre,
        this.form.value.apellido,
        this.form.value.fecha,
        this.form.value.address,
        this.form.value.number,
        this.form.value.area,
        this.form.value.nivel,
        this.form.value.social,
        this.form.value.estado,
        this.form.value.image
      )
    }

    this.form.reset()
  }
}

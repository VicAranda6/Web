import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators'
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService{
  private posts: Post[] = [];// primera matriz
  private postsUpdate = new Subject<Post[]>();

  constructor (private http: HttpClient, private router: Router){}

  getPosts(){
    //return [...this.posts]// segunda matriz (copia)
    this.http.get<{message:string, posts: any}>('http://localhost:3000/api.posts')
    .pipe(map((postData => {
      return postData.posts.map(post =>{
        return{
        id: post._id,
        nombre: post.nombre,
        apellido: post.apellido,
        fecha: post.fecha,
        address: post.address,
        number: post.number,
        area: post.area,
        nivel: post.nivel,
        social: post.social,
        estado: post.estado,
        imagePath: post.imagePath
      }
      })
    })))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts
      this.postsUpdate.next([...this.posts])
    })
  }

  getPostsUpdateListener(){
    return this.postsUpdate.asObservable()
  }

  getPost(id: string){
    //return {...this.posts.find( p => p.id === id)}
    return this.http.get<{_id: string, nombre: string, apellido: string, fecha:string, address:string, number: string, area: string, nivel: string, social: string, estado: string, imagePath: string}>
    ('http://localhost:3000/api.posts/' + id)
  }

  addPost(nombre: string, apellido: string, fecha:string, address:string, number: string, area: string, nivel: string, social: string, estado: string, image: File){
    const postData = new FormData()
    postData.append('nombre', nombre)
    postData.append('apellido', apellido)
    postData.append('fecha', fecha)
    postData.append('address', address)
    postData.append('number', number)
    postData.append('area', area)
    postData.append('nivel', nivel)
    postData.append('social', social)
    postData.append('estado', estado)
    postData.append('image', image, nombre)
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api.posts', postData)
    .subscribe((responseData) => {
      const post: Post={
        id: responseData.post.id,
        nombre: nombre,
        apellido: apellido,
        fecha: fecha,
        address: address,
        number: number,
        area: area,
        nivel: nivel,
        social: social,
        estado: estado,
        imagePath: responseData.post.imagePath}
      this.posts.push(post)
      this.postsUpdate.next([...this.posts])
      this.router.navigate(['/list'])
    })
    }

  updatePost(id: string, nombre: string, apellido: string, fecha:string, address:string, number: string, area: string, nivel: string, social: string, estado: string, image: File | string){
    let postData: Post | FormData
    if(typeof image === "object"){
      postData = new FormData()
      postData.append("id", id)
      postData.append('nombre', nombre)
      postData.append('apellido', apellido)
      postData.append('fecha', fecha)
      postData.append('address', address)
      postData.append('number', number)
      postData.append('area', area)
      postData.append('nivel', nivel)
      postData.append('social', social)
      postData.append('estado', estado)
      postData.append("image", image, nombre)
     }
    this.http.put("http://localhost:3000/api.posts/" + id, postData)
    .subscribe(response => {
      const updatePost = [...this.posts]
      const oldPostIndex = updatePost.findIndex(p => p.id === id)
      const post: Post = {
        id: id,
        nombre: nombre,
        apellido: apellido,
        fecha: fecha,
        address: address,
        number: number,
        area: area,
        nivel: nivel,
        social: social,
        estado: estado,
        imagePath: ""
      }
      updatePost[oldPostIndex] = post
      this.posts = updatePost
      this.postsUpdate.next([...this.posts])
      this.router.navigate(['/list'])
    })
  }

  deletePost(id: string){
    this.http.delete<{message: string}>('http://localhost:3000/api.posts/' + id)
    .subscribe(() => {
      const updatePosts = this.posts.filter(post => post.id != id)
      this.posts = updatePosts
      this.postsUpdate.next([...this.posts])
    })
  }
}

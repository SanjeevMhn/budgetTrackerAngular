import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LockKeyhole, LucideAngularModule, Trash, Wallet } from 'lucide-angular';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  walletIcon = Wallet
  deleteIcon = Trash
  lockIcon = LockKeyhole

  userRegisterState = signal<'name' | 'img' | 'password'>('name')

  userNameForm = new FormGroup({
    name: new FormControl('',[Validators.required])
  })

  get name(){
    return this.userNameForm.get('name')
  }

  get img(){
    return this.userImgForm.get('img')
  }

  userImg = signal<string>('')

  userImgForm = new FormGroup({
    img: new FormControl('')
  })

  userPasswordForm = new FormGroup({
    password: new FormControl('')
  })

  onImgUpload(event: any){
    let file = event.target.files[0] as Blob
    const reader = new FileReader()
    reader.onload = () => {
      let res = reader.result as string
      this.userImgForm.get('img')?.setValue(res)
      this.userImg.set(res)
    }
    reader.readAsDataURL(file)
  }

}

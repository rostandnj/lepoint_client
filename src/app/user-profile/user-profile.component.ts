import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {User} from '../schema/User';
import {Config} from '../config';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../service/user-service';
import {Image} from '../schema/Image';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  userSubscription: Subscription;
  user: User;
  isLogin: boolean;
  isLoginSubscription: Subscription;
  picture = '';
  showPassword = false;
  showPassword2 = false;
  showPassword3 = false;
  editForm: FormGroup;
  editPass: FormGroup;
  editImage: FormGroup;
  loadingForm = false;
  loadingFormPass = false;
  loadingFormImage = false;
  imageURL = '';
  imageError = false;
  imageReal = null;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  hasSettingUser = false;
  editPassError = '';
  birthday = '';

  constructor(private authService: AuthService, private constantService: ConstantsService, private formBuilder: FormBuilder,
              private modalService: BsModalService, private translateService: TranslateService, private userService: UserService) {
    this.globalAlertStatusSubscription = this.constantService.globalAlertStatusSubject.subscribe((res) => {
      this.globalAlertStatus = res;

    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.userSubscription = this.authService.userSubject.subscribe((user: User) => {
      this.user = user;
      if (this.user !== null){
        if (this.user.birthday !== null){
          const da = this.user.birthday.split('-');
          this.birthday = da[1] + '/' + da[0] + '/' + da[2];
        }
        this.picture = Config.apiUrl + 'uploads/profile/' + user.picture;
        if (!this.hasSettingUser){
          this.initForm();
        }
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.isLoginSubscription = this.authService.userIsLoginSubject.subscribe((status: boolean) => {
      this.isLogin = status;
    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  ngOnInit(): void {
  }

  matchPassword(abstractControl: AbstractControl) {
    const password = abstractControl.get('password').value;
    const confirmPassword = abstractControl.get('rpassword').value;
    if (password !== confirmPassword) {
      abstractControl.get('rpassword').setErrors({
        MatchPassword: true
      });
    } else {
      return null;
    }
  }

  toggleShowPassword(num: number) {
    switch (num) {
      case 1:
        this.showPassword = !this.showPassword;
        break;
      case 2:
        this.showPassword2 = !this.showPassword2;
        break;
      case 3:
        this.showPassword3 = !this.showPassword3;
        break;
      default:
        break;
    }

  }

  getInputType(num: number) {
    switch (num) {
      case 1:
        if (this.showPassword) {
          return 'text';
        }
        break;
      case 2:
        if (this.showPassword2) {
          return 'text';
        }
        break;
      case 3:
        if (this.showPassword3) {
          return 'text';
        }
        break;
      default:
        break;
    }
    return 'password';
  }

  open(template: TemplateRef<any>) {
    this.editPass.reset();
    this.editPassError = '';
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  open2(template: TemplateRef<any>) {
    this.editImage.reset();
    this.imageURL = '';
    this.imageError = false;
    this.imageReal = null;
    this.modalRef2 = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  onSubmitForm() {
    this.loadingForm = true;
    this.userService.updateInfo(this.editForm.value).subscribe((res: User) => {
      this.loadingForm = false;
      this.authService.updateUser(res);

    }, (error) => {
      this.loadingForm = false;
      if (error.error.message === undefined){
        this.constantService.updateGlobalStatus(error.error);
      }
      else{
        this.constantService.updateGlobalStatus(error.error.message);
      }
      console.log(error.error);

    }, () => {

    });

  }

  onSubmitPass() {
    this.loadingFormPass = true;
    const data = {'c-password': this.editPass.value.old_password, 'n-password': this.editPass.value.password };
    this.userService.updatePassword(data).subscribe((res) => {
      // console.log(res);
      this.translateService.get('profile updated', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });
      this.modalRef.hide();

    }, (error) => {
      if (error.error.message === undefined){
        this.editPassError = error.error;
      }
      else{
        this.editPassError = error.error.message;
      }
      this.loadingFormPass = false;
    }, () => {
      this.loadingFormPass = false;
    });
  }

  onSubmitImage(){
    const formData = new FormData();
    formData.append('file', this.imageReal);

    this.loadingFormImage = true;
    this.userService.uploadPicture(formData).subscribe((res1: Image) => {
      this.userService.updatePicture({file: res1}).subscribe((res: User) => {
        this.loadingFormImage = false;
        this.authService.updateUser(res);
        this.modalRef2.hide();

      }, (error) => {
        this.loadingFormImage = false;
        if (error.error.message === undefined){
          this.imageError  =  error.error;
        }
        else{
          this.imageError  =  error.error.message;
        }
        console.log(error.error);

      }, () => {

      });

    }, (error1) => {
      if (error1.error.message === undefined){
        this.imageError  =  error1.error;
      }
      else{
        this.imageError  =  error1.error.message;
      }
      console.log(error1.error);
      this.loadingFormImage = false;
    }, () => {
    });

  }

  showPreview(event) {
    this.imageError = false;
    this.imageURL = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageError = true;
        this.imageReal = null;
      }
      else{
        this.editImage.patchValue({
          avatar: file
        });
        this.editImage.get('img').updateValueAndValidity();

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageURL = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.imageReal = file;
      }
    }
    else{
      this.imageURL = '';
      this.editImage.reset();
      this.imageReal = null;
    }

  }

  get f() { return this.editForm.controls; }
  get f2() { return this.editPass.controls; }
  initForm() {
    this.editForm = this.formBuilder.group({
      phone: [this.user.phone, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{9,}$')]],
      birthday: ['']
    });

    this.editPass = this.formBuilder.group({
      old_password: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rpassword: ['', [Validators.required]],
    }, {
      // Used custom form validator name
      validator: this.matchPassword
    });

    this.editImage = this.formBuilder.group({
      img: ['', [Validators.required]],
    });
  }

  showToast(ob, message: string) {
    this.constantService.updateGlobalStatus(message);
  }

  changeDate($event: Event) {
    console.log($event);

  }
}

(function(e){function t(t){for(var s,r,o=t[0],l=t[1],d=t[2],u=0,g=[];u<o.length;u++)r=o[u],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&g.push(i[r][0]),i[r]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(e[s]=l[s]);c&&c(t);while(g.length)g.shift()();return n.push.apply(n,d||[]),a()}function a(){for(var e,t=0;t<n.length;t++){for(var a=n[t],s=!0,o=1;o<a.length;o++){var l=a[o];0!==i[l]&&(s=!1)}s&&(n.splice(t--,1),e=r(r.s=a[0]))}return e}var s={},i={login:0},n=[];function r(t){if(s[t])return s[t].exports;var a=s[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=s,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(a,s,function(t){return e[t]}.bind(null,s));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],l=o.push.bind(o);o.push=t,o=o.slice();for(var d=0;d<o.length;d++)t(o[d]);var c=l;n.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("ce65")},"0491":function(e,t,a){"use strict";var s=a("5027"),i=a.n(s);i.a},1655:function(e,t,a){"use strict";t["a"]={data:function(){return{loading:!1}},methods:{showMessage:function(e,t,a){var s=this;this.$bvModal.msgBoxOk(e,{title:t,size:"sm",buttonSize:"sm",headerClass:"p-2 border-bottom-0",footerClass:"p-2 border-top-0",centered:!0}).then((function(){"login"===a?window.location.href="login.html":"/settings"===a?window.location.href="/settings":a&&s.$router.push(a)}))},fetchErr:function(e){var t=this;e.response?401===e.response.status?this.$store.dispatch("loginOut").then((function(){t.showMessage("Błąd autoryzacji! Zaloguj się ponownie.","Błąd","login")})):405===e.response.status?this.$router.push("/home"):400===e.response.status&&this.showMessage(e.response.data.message,"Błąd","/"):this.showMessage("Błąd serwera, proszę spróbować później.","Błąd","/")}}}},3711:function(e,t,a){},4236:function(e,t,a){},4360:function(e,t,a){"use strict";a("a4d3"),a("e01a"),a("b0c0"),a("d3b7");var s=a("2b0e"),i=a("2f62"),n=a("bc3a"),r=a.n(n);s["default"].use(i["a"]),r.a.defaults.baseURL="http://77.55.214.54:8000/api/",t["a"]=new i["a"].Store({state:{userData:JSON.parse(localStorage.getItem("user-data"))||"",numberOfNewNotifications:0,addDiscardData:{dateOfPayment:null,description:null,name:null,type:"oneTime",cyclicalInterval:null,members:[],spreadType:"spreading"},currentGroupInfo:{groupId:null,userPermission:null,groupDetails:[],groupMembers:[],groupDiscards:[]},discardDetails:{discardInfo:{idDiscard:{}},userObligation:null,payments:[],userPermission:!1,allObligations:[]}},getters:{isLogIn:function(e){return Boolean(e.userData)},isLog:function(){return Boolean(JSON.parse(localStorage.getItem("user-data")))},login:function(e){return e.userData.login},userId:function(e){return e.userData.id},token:function(e){return e.userData.token},addDiscardDateOfPayment:function(e){return e.addDiscardData.dateOfPayment},addDiscardDescription:function(e){return e.addDiscardData.description},addDiscardName:function(e){return e.addDiscardData.name},addDiscardType:function(e){return e.addDiscardData.type},addDiscardCyclicalInterval:function(e){return e.addDiscardData.cyclicalInterval},addDiscardMembers:function(e){return e.addDiscardData.members},addDiscardSpreadType:function(e){return e.addDiscardData.spreadType},groupInfoPermission:function(e){return e.currentGroupInfo.userPermission},groupInfoId:function(e){return e.currentGroupInfo.groupId},groupInfoDetails:function(e){return e.currentGroupInfo.groupDetails},groupInfoMembers:function(e){return e.currentGroupInfo.groupMembers},groupInfoDiscards:function(e){return e.currentGroupInfo.groupDiscards},discardDetailsInfo:function(e){return e.discardDetails.discardInfo},discardDetailsUserObligation:function(e){return e.discardDetails.userObligation},discardDetailsUserPermission:function(e){return e.discardDetails.userPermission},discardDetailsPayments:function(e){return e.discardDetails.payments},discardDetailsAllObligation:function(e){return e.discardDetails.allObligations},numberOfNewNotifications:function(e){return e.numberOfNewNotifications}},mutations:{loginSuccess:function(e,t){e.userData=t},deleteToken:function(e){e.userData=""},addDiscardDateOfPayment:function(e,t){e.addDiscardData.dateOfPayment=t},addDiscardName:function(e,t){e.addDiscardData.name=t},addDiscardDescription:function(e,t){e.addDiscardData.description=t},addDiscardType:function(e,t){e.addDiscardData.type=t},addDiscardCyclicalInterval:function(e,t){e.addDiscardData.cyclicalInterval=t},addDiscardMembers:function(e,t){e.addDiscardData.members=t},addDiscardSpreadType:function(e,t){e.addDiscardData.spreadType=t},groupInfoPermission:function(e,t){e.currentGroupInfo.userPermission=t},groupInfoId:function(e,t){e.currentGroupInfo.groupId=t},groupInfoDetails:function(e,t){e.currentGroupInfo.groupDetails=t},groupInfoMembers:function(e,t){e.currentGroupInfo.groupMembers=t},groupInfoDiscards:function(e,t){e.currentGroupInfo.groupDiscards=t},numberOfNewNotifications:function(e,t){e.numberOfNewNotifications=t},discardDetails:function(e,t){e.discardDetails.discardInfo=t.discard,e.discardDetails.userObligation=t.userObligation,e.discardDetails.allObligations=t.obligations,e.discardDetails.payments=t.payments,e.discardDetails.userPermission="admin"===t.permission||"owner"===t.permission}},actions:{setLogin:function(e,t){var a=e.commit,s=e.state,i=s.userData;i.login=t,localStorage.setItem("user-data",JSON.stringify(i)),a("loginSuccess",i)},loginIn:function(e,t){var a=e.commit;return new Promise((function(e,s){r.a.post("user/login",t).then((function(t){var s=t.data.user;localStorage.setItem("user-data",JSON.stringify(s)),a("loginSuccess",s),e(t)})).catch((function(e){localStorage.removeItem("user-data"),a("deleteToken"),s(e)}))}))},loginOut:function(e){var t=e.commit;return new Promise((function(e){localStorage.removeItem("user-data"),t("deleteToken"),e()}))},getDiscardDetails:function(e,t){var a=e.commit;return new Promise((function(e,s){r.a.get("discard/group/details/".concat(t)).then((function(t){t.data.data&&a("discardDetails",t.data.data),e(t.data.data)})).catch((function(e){s(e)}))}))},refreshNumberOfNotifications:function(e){var t=e.commit;r.a.get("/notification/number").then((function(e){null!==e.data.data&&(t("numberOfNewNotifications",e.data.data),console.log(e.data.data))}))}},modules:{}})},5027:function(e,t,a){},"59f0":function(e,t,a){"use strict";var s=a("3711"),i=a.n(s);i.a},"71a6":function(e,t,a){"use strict";var s=a("4236"),i=a.n(s);i.a},"7f32":function(e,t,a){"use strict";var s=a("bee8"),i=a.n(s);i.a},8637:function(e,t,a){},"9b19":function(e,t,a){e.exports=a.p+"img/logo.84c243aa.svg"},afe1:function(e,t,a){"use strict";var s=a("8637"),i=a.n(s);i.a},bee8:function(e,t,a){},ce65:function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var s=a("2b0e"),i=a("bc3a"),n=a.n(i),r=a("a7fe"),o=a.n(r),l=a("5f5b"),d=a("b1e0"),c=a("1655"),u=a("8c4f"),g=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"mx-auto col-11 col-md-8 col-lg-6\ncol-xl-4 shadow-lg p-0 mt-2",attrs:{id:"loginRegisterWrapper"}},[a("div",{staticClass:"d-flex"},[a("div",{staticClass:"col-6 p-3 font-weight-bold",class:{active:"register"===e.selectedForm},attrs:{id:"log"},on:{click:function(t){return e.changeForm("login")}}},[e._v(" Logowanie ")]),a("div",{staticClass:"col-6 p-3 font-weight-bold",class:{active:"login"===e.selectedForm},attrs:{id:"reg"},on:{click:function(t){return e.changeForm("register")}}},[e._v(" Rejestracja ")])]),a("div",{staticClass:"mx-auto col-lg-8 col-xl-7 col-sm-9 col-10 p-3",attrs:{id:"formContainer"}},["login"===e.selectedForm?a("login"):e._e(),"register"===e.selectedForm?a("register",{on:{register:function(t){return e.changeForm("login")}}}):e._e()],1)])},m=[],p=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-form",{staticClass:"d-flex flex-column",on:{submit:function(t){return t.preventDefault(),e.loginIn(t)}}},[a("b-form-input",{staticClass:"mt-3",attrs:{id:"login",placeholder:"Login",size:"sm",type:"text",required:""},on:{input:e.clearError},model:{value:e.loginInput,callback:function(t){e.loginInput=t},expression:"loginInput"}}),a("b-form-input",{staticClass:"mt-3",attrs:{id:"password",placeholder:"Hasło",required:"",size:"sm",type:"password"},on:{input:e.clearError},model:{value:e.passwordInput,callback:function(t){e.passwordInput=t},expression:"passwordInput"}}),a("b-form-invalid-feedback",{attrs:{state:""===e.loginErrorMessage}},[e._v(" "+e._s(e.loginErrorMessage)+" ")]),a("div",{staticClass:"mt-3 d-flex flex-column"},[a("a",{staticClass:"ml-0",on:{click:e.goToReset}},[e._v("Resetowanie hasła")]),a("a",{staticClass:"ml-0",on:{click:e.goToLoginRemember}},[e._v("Przypomnij login")])]),a("b-button",{staticClass:"mt-3 mx-auto shadow font-weight-bold",attrs:{type:"submit",id:"d"}},[e._v(" Zaloguj ")]),e.loading?a("b-spinner",{staticStyle:{position:"fixed",top:"49%",left:"49%",width:"3rem",height:"3rem",color:"#148A14"}}):e._e()],1)},f=[],h={name:"Login",data:function(){return{loginInput:"",passwordInput:"",loginErrorMessage:"",loading:!1}},methods:{clearError:function(){this.loginErrorMessage=""},goToReset:function(){this.$router.push({path:"/login/password/reset"})},goToLoginRemember:function(){this.$router.push({path:"/login/remember"})},loginIn:function(){var e=this,t=new FormData;t.append("login",this.loginInput),t.append("password",this.passwordInput),this.loading=!0,this.$store.dispatch("loginIn",t).then((function(){window.location.href="/",e.loading=!1})).catch((function(t){"notActive"===t.response.data.data?e.loginErrorMessage="Musisz aktywować konto, sprawdź e-mail.":"deleted"===t.response.data.data?e.loginErrorMessage="Konto jest usunięte.":e.loginErrorMessage="Logowanie nie powiodło się.",e.loading=!1}))}}},v=h,w=a("2877"),b=Object(w["a"])(v,p,f,!1,null,null,null),R=b.exports,y=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-form",{staticClass:"d-flex flex-column",on:{submit:function(t){return t.preventDefault(),e.registration(t)}}},[a("b-form-group",{attrs:{label:"Podaj Login*","invalid-feedback":e.validationRegisterMessages.login,state:e.validationRegisterStatesRequired.login}},[a("b-form-input",{staticClass:"mt-3",attrs:{id:"login",placeholder:"Login",state:e.validationRegisterStatesRequired.login,size:"sm"},on:{input:e.validateLogin},model:{value:e.loginRegister,callback:function(t){e.loginRegister=t},expression:"loginRegister"}})],1),a("b-form-group",{attrs:{label:"Podaj E-mail*","invalid-feedback":e.validationRegisterMessages.email,state:e.validationRegisterStatesRequired.email}},[a("b-form-input",{staticClass:"mt-3",attrs:{id:"email",placeholder:"E-mail",state:e.validationRegisterStatesRequired.email,size:"sm"},on:{input:e.validateEmail},model:{value:e.emailRegister,callback:function(t){e.emailRegister=t},expression:"emailRegister"}})],1),a("b-form-group",{attrs:{label:"Podaj Hasło*","invalid-feedback":e.validationRegisterMessages.passwordRegister,state:e.validationRegisterStatesRequired.passwordRegister}},[a("b-form-input",{staticClass:"mt-3",attrs:{id:"password",type:"password",placeholder:"Hasło",state:e.validationRegisterStatesRequired.passwordRegister,size:"sm"},on:{input:e.validatePassword},model:{value:e.passwordRegister,callback:function(t){e.passwordRegister=t},expression:"passwordRegister"}})],1),a("b-form-group",{attrs:{label:"Powtórz Hasło*","invalid-feedback":e.validationRegisterMessages.passwordTwoRegister,state:e.validationRegisterStatesRequired.passwordTwoRegister}},[a("b-form-input",{staticClass:"mt-3",attrs:{id:"passwordTwo",type:"password",placeholder:"Powtórz Hasło",state:e.validationRegisterStatesRequired.passwordTwoRegister,size:"sm"},on:{input:e.validateTwoPassword},model:{value:e.passwordTwoRegister,callback:function(t){e.passwordTwoRegister=t},expression:"passwordTwoRegister"}})],1),a("b-form-group",{attrs:{label:"Avatar","invalid-feedback":e.validationRegisterMessages.avatar,state:e.validationRegisterStatesNotRequired.avatar}},[a("b-form-file",{staticClass:"mt-3 text-left",attrs:{placeholder:"Wgraj avatar","drop-placeholder":"Wgraj avatar",state:e.validationRegisterStatesNotRequired.avatar,size:"sm"},on:{change:function(t){return e.uploadAvatar(t)}}})],1),a("b-form-text",[e._v("Pola oznaczone * są obowiązkowe")]),a("b-form-invalid-feedback",{attrs:{state:""===e.registerErrorMessage}},[e._v(" "+e._s(e.registerErrorMessage)+" ")]),a("b-button",{staticClass:"mt-3 mx-auto shadow font-weight-bold",attrs:{type:"submit"}},[e._v(" Zarejestruj ")])],1)},D=[],x=(a("7db0"),a("b0c0"),a("07ac"),a("ac1f"),a("1276"),{name:"Register",data:function(){return{validationRegisterStatesRequired:{login:null,email:null,passwordRegister:null,passwordTwoRegister:null},validationRegisterStatesNotRequired:{avatar:null},validationRegisterMessages:{passwordTwoRegister:"Hasła są od siebie różne"},loginRegister:"",passwordRegister:"",passwordTwoRegister:"",emailRegister:"",userAvatarRegister:"",registerErrorMessage:""}},methods:{checkLoginavailability:function(){var e=this;this.axios.get("/user/checkLogin?login=".concat(this.loginRegister)).then((function(t){!0===t.data.message?(e.validationRegisterStatesRequired.login=!1,e.validationRegisterMessages.login=" Login jest już w użyciu."):e.validationRegisterStatesRequired.login=!0}))},checkEmailavailability:function(){var e=this;this.axios.get("/user/checkEmail?email=".concat(this.emailRegister)).then((function(t){!0===t.data.message?(e.validationRegisterStatesRequired.email=!1,e.validationRegisterMessages.email=" E-mail jest już w użyciu."):e.validationRegisterStatesRequired.email=!0}))},uploadAvatar:function(e){var t=[e.target.files[0]];this.userAvatarRegister=t[0],this.validationRegisterMessages.avatar="",this.validationRegisterStatesNotRequired.avatar=!0;var a=["JPG","PNG"],s=this.userAvatarRegister.name.split(".").pop().toUpperCase(),i=a.find((function(e){return e===s}));void 0===i&&(this.validationRegisterStatesNotRequired.avatar=!1,this.validationRegisterMessages.avatar+="Tylko jpg i png"),this.userAvatarRegister.size>1024e3&&(this.validationRegisterStatesNotRequired.avatar=!1,this.validationRegisterMessages.avatar+="Maksymalny rozmiar avatara to 1 mb.")},validateLogin:function(){this.validationRegisterStatesRequired.login=!0,this.validationRegisterMessages.login="",/^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){3,19}[a-zA-Z0-9]$/.test(this.loginRegister)?this.checkLoginavailability():(this.validationRegisterStatesRequired.login=!1,this.loginRegister.length<5&&(this.validationRegisterMessages.login+="- jest zbyt krótki "),this.loginRegister.length>21&&(this.validationRegisterMessages.login+="- jest za długi "),/^[a-zA-Z0-9]/.test(this.loginRegister)||(this.validationRegisterMessages.login+="- musi rozpoczynać się od litery lub cyfry "),/[a-zA-Z0-9]$/.test(this.loginRegister)||(this.validationRegisterMessages.login+="- musi kończyć się literą lub cyfrą "),/^[a-zA-Z0-9_-]*$/.test(this.loginRegister)||(this.validationRegisterMessages.login+="- może zawierać litery i cyfry oraz - i _ "),/[_-]{2,}/.test(this.loginRegister)&&(this.validationRegisterMessages.login+="- _ i - nie mogą występować podwójnie lub obok siebie"))},validateEmail:function(){this.validationRegisterStatesRequired.email=!0,this.validationRegisterMessages.email="",/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.emailRegister)?this.checkEmailavailability():(this.validationRegisterStatesRequired.email=!1,this.validationRegisterMessages.email=" E-mail jest nieprawidłowy")},validatePassword:function(){this.validationRegisterStatesRequired.passwordRegister=!0,this.validationRegisterMessages.passwordRegister="",/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(this.passwordRegister)||(this.validationRegisterStatesRequired.passwordRegister=!1,this.passwordRegister.length<8&&(this.validationRegisterMessages.passwordRegister+="- zbyt krótkie"),/^(?=.*[A-Z])/.test(this.passwordRegister)||(this.validationRegisterMessages.passwordRegister+="- musi zawierać jedną dużą literę"),/^(?=.*[a-z])/.test(this.passwordRegister)||(this.validationRegisterMessages.passwordRegister+="- musi zawierać jedną małą literę"),/^(?=.*[0-9])/.test(this.passwordRegister)||(this.validationRegisterMessages.passwordRegister+="- musi zawierać jedną cyfrę."))},validateTwoPassword:function(){this.validationRegisterStatesRequired.passwordTwoRegister=!(this.passwordRegister!==this.passwordTwoRegister||!1===this.validationRegisterStatesRequired.passwordRegister)},validationAll:function(){this.validateLogin(),this.validateEmail(),this.validatePassword(),this.validateTwoPassword()},registration:function(){var e=this;this.validationAll();var t=Object.values(this.validationRegisterStatesRequired).find((function(e){return!1===e}));if(void 0===t){var a=new FormData;a.append("login",this.loginRegister),a.append("email",this.emailRegister),a.append("password",this.passwordRegister),!0===this.validationRegisterStatesNotRequired.avatar&&a.append("userAvatar",this.userAvatarRegister),this.axios({method:"post",url:"/user/register",data:a,headers:{"Content-Type":"multipart/form-data"}}).then((function(){e.showMessage("Zarejestrowano","Rejestracja","")})).catch((function(t){e.registerErrorMessage=t.response.data.message,e.showMessage("Coś poszło nie tak","Edycja grupy","")}))}}}}),S=x,I=Object(w["a"])(S,y,D,!1,null,"323fabc8",null),E=I.exports,k={name:"LoginRegister",components:{Login:R,Register:E},data:function(){return{selectedForm:"login",infoData:{title:"Rejestracja",info:"Konto zostało utworzone!",buttonText:"Do strony logowania"}}},methods:{changeForm:function(e){this.selectedForm=e}}},q=k,M=(a("7f32"),Object(w["a"])(q,g,m,!1,null,"96964630",null)),z=M.exports,j=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("EmailRequestSend",{attrs:{title:"Resetowanie Hasła"},on:{sendData:e.send}})],1)},C=[],_=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-container",{staticClass:"mx-auto col-11 col-lg-4 col-sm-8 shadow-lg\np-0 mt-2 p-3",attrs:{id:"emailRequestWrapper"}},[a("h2",{staticClass:"mb-3 greenText"},[e._v(e._s(e.title))]),a("b-form",{staticClass:"d-flex flex-column col-10 mx-auto"},[a("b-form-group",{attrs:{label:"Podaj E-mail","invalid-feedback":e.validationMessage,state:e.validationState}},[a("b-form-input",{staticClass:"mt-3",attrs:{placeholder:"E-mail",state:e.validationState,size:"sm"},on:{change:e.validateEmail},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}})],1),a("div",{staticClass:"my-2"},[a("b-button",{staticClass:"mt-3 mx-1 shadow font-weight-bold btnGreen",on:{click:e.send}},[e._v(" Ok ")]),a("b-button",{staticClass:"mt-3 mx-1 shadow font-weight-bold btnGreen",on:{click:e.back}},[e._v(" Anuluj ")])],1)],1)],1)},P=[],O=(a("96cf"),a("1da1")),T={name:"EmailRequestSend",props:{title:{type:String,required:!0}},data:function(){return{validationState:null,validationMessage:"",email:""}},methods:{validateEmail:function(){var e=this;return Object(O["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.validationState=!0,e.validationMessages="",t.next=4,e.axios.get("/user/checkEmail?email=".concat(e.email)).then((function(t){e.validationState=t.data.message}));case 4:e.validationMessage=e.validationState?"":"Podany e-mail nie jest przypisany do żadnego konta.";case 5:case"end":return t.stop()}}),t)})))()},send:function(){var e=this;return Object(O["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.validateEmail();case 2:e.validationState&&e.$emit("sendData",e.email);case 3:case"end":return t.stop()}}),t)})))()},back:function(){this.$router.go(-1)}}},A=T,L=(a("afe1"),Object(w["a"])(A,_,P,!1,null,"4d7c4041",null)),N=L.exports,$={name:"PasswordResetEmail",components:{EmailRequestSend:N},methods:{send:function(e){var t=this,a=new FormData;a.append("email",e),this.axios.post("/user/password/reset",a).then((function(){t.showMessage("Na podany adres e-mail została wysłana wiadomość z linkiem.","Resetowanie hasła","login")})).catch((function(e){t.fetchErr(e)}))}}},F=$,Z=Object(w["a"])(F,j,C,!1,null,"017e038e",null),G=Z.exports,H=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-container",{staticClass:"shadow mx-auto col-11 col-sm-8 darkBg col-md-7 col-lg-5 col-xl-4 p-3",attrs:{id:"resetPasswordWrapper"}},[a("h2",{staticClass:"mb-3 greenText"},[e._v(" Zmiana Hasła ")]),e.isCorrectRequest?a("b-form",{staticClass:"d-flex flex-column col-10 mx-auto"},[a("b-form-group",{attrs:{label:"Nowe Hasło","invalid-feedback":e.validationMessages.password,state:e.validationRequiredStates.password}},[a("b-form-input",{staticClass:"mt-3",attrs:{type:"password",placeholder:"Hasło",state:e.validationRequiredStates.password,size:"sm"},on:{input:e.validatePassword},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1),a("b-form-group",{attrs:{label:"Powtórz Hasło","invalid-feedback":e.validationMessages.passwordTwo,state:e.validationRequiredStates.passwordTwo}},[a("b-form-input",{staticClass:"mt-3",attrs:{type:"password",placeholder:"Powtórz Hasło",state:e.validationRequiredStates.passwordTwo,size:"sm"},on:{input:e.validateTwoPassword},model:{value:e.passwordTwo,callback:function(t){e.passwordTwo=t},expression:"passwordTwo"}})],1),a("b-button",{staticClass:"mt-3 mx-auto shadow font-weight-bold btnGreen",on:{click:e.save}},[e._v(" Zapisz ")])],1):a("div",[e._v(" Link jest niepoprawny. ")])],1)},B=[],J={name:"PasswordReset",props:["requestId"],data:function(){return{validationRequiredStates:{password:null,passwordTwo:null},validationMessages:{passwordTwo:"Hasła są od siebie różne"},message:"Link jest nieważny",isCorrectRequest:!1,password:"",passwordTwo:""}},methods:{validatePassword:function(){this.validationRequiredStates.password=!0,this.validationMessages.password="",/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(this.password)||(this.validationRequiredStates.password=!1,this.password.length<8&&(this.validationMessages.password+="- zbyt krótkie"),/^(?=.*[A-Z])/.test(this.password)||(this.validationMessages.password+="- musi zawierać jedną dużą literę"),/^(?=.*[a-z])/.test(this.password)||(this.validationMessages.password+="- musi zawierać jedną małą literę"),/^(?=.*[0-9])/.test(this.password)||(this.validationMessages.password+="- musi zawierać jedną cyfrę."))},validateTwoPassword:function(){this.validationRequiredStates.passwordTwo=!(this.password!==this.passwordTwo||!1===this.validationRequiredStates.password)},validateAll:function(){this.validatePassword(),this.validateTwoPassword()},save:function(){var e=this;this.validateAll();var t=Object.values(this.validationRequiredStates).find((function(e){return!1===e}));if(void 0===t){var a=new FormData;a.append("password",this.password),a.append("requestId",this.requestId),this.axios.post("/user/password/reset/change",a).then((function(){e.showMessage("Hasło zostało zmienione","Resetowanie Hasła","/login")})).catch((function(t){e.fetchErr(t)}))}}},mounted:function(){var e=this;this.axios.get("/user/request/check/".concat(this.requestId)).then((function(t){e.isCorrectRequest=t.data.data}))}},W=J,U=(a("59f0"),Object(w["a"])(W,H,B,!1,null,"2505950c",null)),K=U.exports,V=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("EmailConfirmation",{attrs:{message:e.message,title:"Zmiana E-mail"}})},Q=[],X=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-container",{staticClass:"shadow mx-auto col-11 col-sm-8 darkBg col-md-7 col-lg-5 col-xl-4 p-3",attrs:{id:"emailConfirmationdWrapper"}},[a("h2",{staticClass:"mb-3 greenText"},[e._v(" "+e._s(e.title)+" ")]),a("div",[e._v(" "+e._s(e.message)+" ")]),a("b-button",{staticClass:"btnGreen mt-2",on:{click:e.toHomePage}},[e._v(" Strona Główna")])],1)},Y=[],ee={name:"EmailConfirmation",props:{message:{type:String,required:!0},title:{type:String,required:!0}},methods:{toHomePage:function(){this.$router.push({path:"/login"})}}},te=ee,ae=(a("71a6"),Object(w["a"])(te,X,Y,!1,null,"785d29f9",null)),se=ae.exports,ie={name:"EmailChangeConfirmation",components:{EmailConfirmation:se},props:["requestId"],data:function(){return{message:""}},created:function(){var e=this,t=new FormData;t.append("requestId",this.requestId),this.axios.post("/user/email/change/confirmation",t).then((function(t){e.message=t.data.data?"E-mail został zmieniony na ".concat(t.data.data):"Link wygasł."})).catch((function(t){e.fetchErr(t)}))}},ne=ie,re=Object(w["a"])(ne,V,Q,!1,null,"53513d43",null),oe=re.exports,le=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("EmailConfirmation",{attrs:{message:e.message,title:"Zmiana E-mail"}})},de=[],ce={name:"AccountActivate",components:{EmailConfirmation:se},props:["requestId"],data:function(){return{message:""}},created:function(){var e=this,t=new FormData;t.append("requestId",this.requestId),this.axios.post("/user/account/activate",t).then((function(t){e.message=t.data.data?"Konto zostało aktywowane":"Link wygasł."})).catch((function(t){e.fetchErr(t)}))}},ue=ce,ge=Object(w["a"])(ue,le,de,!1,null,"9e7df21c",null),me=ge.exports,pe=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("EmailRequestSend",{attrs:{title:"Przypomnienie Loginu"},on:{sendData:e.send}})},fe=[],he={name:"LoginRememberEmail",components:{EmailRequestSend:N},methods:{send:function(e){var t=this,a=new FormData;a.append("email",e),this.axios.post("/user/login/remember",a).then((function(){t.showMessage("Na podany adres e-mail została wysłana wiadomość z loginem.","Przypomnienie loginu","login")})).catch((function(e){t.fetchErr(e)}))}}},ve=he,we=Object(w["a"])(ve,pe,fe,!1,null,"38981bd3",null),be=we.exports,Re=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("EmailConfirmation",{attrs:{message:e.message,title:"Zmiana E-mail"}})},ye=[],De={name:"RestoreAccount",components:{EmailConfirmation:se},props:["requestId"],data:function(){return{message:""}},created:function(){var e=this,t=new FormData;t.append("requestId",this.requestId),this.axios.post("/user/restore",t).then((function(t){e.message=t.data.data?"Konto ".concat(t.data.data," zostało przywrócone"):"Link wygasł."})).catch((function(t){e.fetchErr(t)}))}},xe=De,Se=Object(w["a"])(xe,Re,ye,!1,null,"94b1cbee",null),Ie=Se.exports;s["default"].use(u["a"]);var Ee=[{path:"/login",name:"LoginRegister",component:z},{path:"/login/password/reset",name:"PasswordResetEmail",component:G},{path:"/login/password/change/:requestId",name:"PasswordReset",component:K,props:!0},{path:"/login/email/change/confirmation/:requestId",name:"EmailChangeConfirmation",component:oe,props:!0},{path:"/login/account/activate/:requestId",name:"AccountActivate",component:me,props:!0},{path:"/login/remember",name:"LoginRememberEmail",component:be,props:!0},{path:"/login/user/restore/:requestId",name:"RestoreAccount",component:Ie,props:!0},{path:"/*",redirect:{name:"LoginRegister"}}],ke=new u["a"]({mode:"history",base:"/",routes:Ee}),qe=ke,Me=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"m-0 d-flex align-items-center",attrs:{id:"app"}},[a("div",{staticClass:"col-12"},[e._m(0),a("transition",{attrs:{name:"routerAnimation",mode:"out-in"}},[a("router-view")],1)],1)])},ze=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"row align-items-center justify-content-center m-0"},[s("img",{staticClass:"img-fluid",attrs:{width:"100",alt:"Vue logo",src:a("9b19")}}),s("h1",{staticClass:"greenText font-weight-bold"},[e._v("CashFriends")])])}],je={name:"Index",beforeCreate:function(){this.$store.getters.isLogIn&&"EmailChangeConfirmation"!==this.$route.name&&(window.location.href="index.html")}},Ce=je,_e=(a("0491"),Object(w["a"])(Ce,Me,ze,!1,null,null,null)),Pe=_e.exports,Oe=a("4360");n.a.defaults.baseURL="http://77.55.214.54:8000/api/",s["default"].config.productionTip=!1,s["default"].use(o.a,n.a),s["default"].use(l["a"]),s["default"].use(d["a"]),s["default"].mixin(c["a"]),new s["default"]({router:qe,store:Oe["a"],render:function(e){return e(Pe)}}).$mount("#app")}});
//# sourceMappingURL=login.45c06212.js.map
/* Buttons */
async function cotizar_btn(ev) {
   for(m of activeModules) {
      logEvent('w_pricing_actbtn_' + m)
   }
}

/* Analytics */
var _f_analytics = null
function initAnalytics() {
   const firebaseConfig = {
      apiKey: "AIzaSyAi96LiS3P-4TNfa3tmqmFO7oy5Bj7MVDw",
      authDomain: "veccico.firebaseapp.com",
      databaseURL: "https://veccico-default-rtdb.firebaseio.com",
      projectId: "veccico",
      storageBucket: "veccico.appspot.com",
      messagingSenderId: "1000951746381",
      appId: "1:1000951746381:web:3fa145f6a6a70ffddeb104",
      measurementId: "G-1RW98VBJKG"
   }
    
   // Initialize Firebase
   firebase.initializeApp(firebaseConfig);
   // Initialize Firebase Analytics
   _f_analytics = firebase.analytics()
}

function logEvent(event) {
   console.log('[Analytics]', event)
   _f_analytics.logEvent(event, {})
}

function showDiscount (num_modules, totalPrice) {
    console.log('EL NUMERO DE MÓDULOS ES: ', num_modules)
    const DISCOUNTS = [
      { 'total_modules': 4, 'percent': 5 },
      { 'total_modules': 5, 'percent': 7 },
      { 'total_modules': 6, 'percent': 8 },
      { 'total_modules': 7, 'percent': 9 },
      { 'total_modules': 8, 'percent': 9.5 },
      { 'total_modules': 9, 'percent': 10 },
      { 'total_modules': 10, 'percent': 10 },
      { 'total_modules': 11, 'percent': 10 },
      { 'total_modules': 12, 'percent': 11 },
      { 'total_modules': 13, 'percent': 12 },
      { 'total_modules': 14, 'percent': 13 },
      { 'total_modules': 15, 'percent': 14 },
      { 'total_modules': 16, 'percent': 15 },
    ]
    
    const startDiscount = DISCOUNTS[0].total_modules
    const lastDiscount = DISCOUNTS[DISCOUNTS.length-1].total_modules
    const minPrice = 580000
    
    const findDiscount = DISCOUNTS.find( (discount) => discount.total_modules === num_modules )
    
    const putDiscountInScreen = (num) => {
      let DOMdiscountValue = document.getElementById('discount-value')
      console.log('Porcentaje descuento: ', num)      
      DOMdiscountValue.textContent = `${num}%`    
    }
    
    const showInDOM = (modules, price) => {
      let DOMdiscountBlock = document.getElementById('your-discount')
      let DOMblockItem = document.getElementById('discount-message')
      let DOMattainDiscount = document.getElementById('attain-discount')
      console.log('SHOW DOM',modules)      
      
      const discountNotAvailable = (module) => {
        let DOMattainModules = document.getElementById('attain-modules')
        let DOMmoduleTxtSingular = document.getElementById('module-plural-of-singular')
        let reduceModules = Math.abs(startDiscount - module)
        reduceModules == 1 ? DOMmoduleTxtSingular.textContent = 'módulo' : DOMmoduleTxtSingular.textContent = 'módulos'
        DOMblockItem.classList.remove('show')
        DOMattainModules.textContent = reduceModules
        DOMattainDiscount.style.display = "block"     
      }
      const discountAvailable = () => {
        DOMattainDiscount.style.display = "none"
        DOMblockItem.classList.add('show')
      }
      modules >= startDiscount ? discountAvailable() : discountNotAvailable(modules)
      price < minPrice ? DOMdiscountBlock.style.display="none" : DOMdiscountBlock.style.display="block"
    }  
   
    if (num_modules >= startDiscount && num_modules <= lastDiscount ) {
      showInDOM(findDiscount.total_modules, totalPrice)
      putDiscountInScreen(findDiscount.percent)
    }
    else if (num_modules > lastDiscount) {
      putDiscountInScreen(15)
    } else { 
      showInDOM(num_modules, totalPrice)
      return
    }   
    
  }

// Part 3

function CalculateFactorAdelantos(number_collaborators) {
    const RANGES = [
      { 'start': 1, 'end': 100, 'factor':1.3 },
      { 'start': 101, 'end': 500, 'factor':1.3 },
      { 'start': 501, 'end': 1000, 'factor':1.5 },
      { 'start': 1001, 'end': 2500, 'factor':1.5 },
      { 'start': 2501, 'end': 5000, 'factor':1.6 },
      { 'start': 5001, 'end': 7500, 'factor':1.7 },
      { 'start': 7501, 'end': 10000, 'factor':1.7 },
      { 'start': 10001, 'end': 15000, 'factor':1.7 },
      { 'start': 15001, 'end': 20000, 'factor':1.72 },
    ]
    
    const lastRange = RANGES[RANGES.length-1]
    const factorOverRanges = 1.72
       
    if (number_collaborators <= lastRange.end ) {
      for(let i = 0; i < RANGES.length; i++) {
        let range = RANGES[i]
        console.log(range)
        if(range.start <= number_collaborators && range.end >= number_collaborators) {
          let findFactor = range.factor
          console.log('Factor Encontrado: ', findFactor)
          return findFactor
        }
    
      }
    } else {
      return factorOverRanges
    }
  }

var totalResidences = 80
var isAnnually = true //basicActive
var activeModules = []
var totalPaid = 1

let RESIDENCE_PRICE = 2300
let PLAN_BASIC = 250000
let PLAN_ADVANCE = 350000

const urlForPricing = "https://449gwidd80.execute-api.us-east-1.amazonaws.com/prod/client/vecci/config?query={pricing}"

function onChangePlan(type) {
   isAnnually = type == 'annual'
    calculatePrice()
}
function onChangeUnits() {
    const residences = parseInt(document.querySelector('#residences').value)
    totalResidences = Math.max(1, residences)
    calculatePrice()
}
function onToggleModule(e) {
   const mod = e.target.id
   console.log({mod})
   const input = document.querySelector('#'+mod)
   if(input.checked) {
      activeModules.push(mod)
   } else {
      activeModules = activeModules.filter(m => m != mod)
   }
}

function calculatePrice() {
   // const currency = document.querySelector('#currency-pricing')
   const resultado = document.querySelector('#resultado')
   const resultadoSmall = document.querySelector('#resultado-small')
   const resultadoHint = document.querySelector('#resultado-hint')

   const FIRST_MODULE = 60000*2
   const NEXT_MODULES = 24000*2

   // let price = 0
   // let hasModules = activeModules.length > 0
   // if(totalPaid > 0) {
   //    price = totalPaid == 1 ? FIRST_MODULE : FIRST_MODULE + NEXT_MODULES*(totalPaid-1)
   // }
   // if(isAnnually) {
   //    price = price*10/12
   // }
   // console.log({hasModules, totalPaid, isAnnually, price})

   let price = 840000
   let monthPrice = price / 12.0
   resultado.innerHTML = `$${numberWithCommas(Math.ceil(monthPrice))}`
   resultadoSmall.innerHTML = `<p>$${numberWithCommas(Math.ceil(monthPrice/Math.max(totalResidences, 1)))} COP por casa al mes</p>`
   resultadoHint.innerHTML = `<p>1 pago único: $${numberWithCommas(price)} al año</p>`
   return
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  function abc(selectedguy) {
      setTimeout(function () {
      
  //////////////////////////////////////   
  // asicnacion de variables//
  var N_colaboradores  =   document.getElementById('N_colaboradores').value;
  //  
  var Basico    = document.getElementById('basico1')  ;
  var Avanzado  = document.getElementById('avanzado1');
  // captura datos de los modulos
      var Modulo_1  = document.getElementById("Modulo_1") ;
      var Modulo_3  = document.getElementById("Modulo_3") ;
      var Modulo_4  = document.getElementById("Modulo_4") ;
      var Modulo_5  = document.getElementById("Modulo_5") ;
      var Modulo_6  = document.getElementById("Modulo_6") ;
      var Modulo_7  = document.getElementById("Modulo_7") ;
      var Modulo_8  = document.getElementById("Modulo_8") ;
      var Modulo_10 = document.getElementById("Modulo_10");
      var Addons_1 = document.getElementById("Addons_1");
    var Addons_5 = document.getElementById("Addons_5"); 
      var Addons_7 = document.getElementById("Addons_7"); 
    var Addons_8 = document.getElementById("Addons_8");
                                                                    
  var Cliente_Buk_descuento    =   1; 
  var version_light_descuento  =   1;
  var N_resintos_Tabla         ; 
  var Colaboradores_base       ;
  var Costo_Base               ;
  var Costo_Marginal           ;  
  var Subtotal                 ;  
  var total                    ;
  
  ///////////////////////////////
  /// Tabla de Valores  
  var Gestion_de_personas              =         0 ;   /* gestion_de_persona es un valor que se aplica gestion de persona basico y avansado */ 
  //
  /// costos bases.  
  var Costo_Base_De_1_A_100            =    0.000 ;
  var Costo_Base_De_101_A_500          =    450000 ;
  var Costo_Base_De_501_A_1000         =    1510000 ;
  var Costo_Base_De_1001_A_2500        =    2632500 ;
  var Costo_Base_De_2501_A_5000        =    5955000 ;
  var Costo_Base_De_5001_A_7500        =    10005000 ;
  var Costo_Base_De_7501_A_10000       =    13792500 ;
  var Costo_Base_De_10001_A_15000      =    17580000 ;
  var Costo_Base_De_15001_A_20000      =    25155000 ;
  //  
  /// Costa marginal.  
  var Costo_Marginal_De_1_A_100        =     4500 ;  
  var Costo_Marginal_De_101_A_500      =     2650 ; 
  var Costo_Marginal_De_501_A_1000     =     2245 ;   
  var Costo_Marginal_De_1001_A_2500    =     2215 ;  
  var Costo_Marginal_De_2501_A_5000    =     1620 ; 
  var Costo_Marginal_De_5001_A_7500    =     1515 ;   
  var Costo_Marginal_De_7501_A_10000   =     1515 ;  
  var Costo_Marginal_De_10001_A_15000  =     1515 ; 
  var Costo_Marginal_De_15001_A_20000  =     1360 ; 
  //
  //  Gestion de personas  
  var Gestion_de_personas_basico       =         1 ;
  var Gestion_de_personas_avanzado     =       0.2 ; 
  //
  //valor de factorese de los modulos
  //
  var Valor_Gestion_de_persona         =         1;
  var Factor_Gestion_de_personas       =         1;  
  var Suma_de_factores                 =         0;
  var Suma_de_modulos                  =         1;
  var Descuento_total                  =         0;
  
  //////////////  
   var Modulo_1_factor = 0; 
    
   var Modulo_3_factor = 0;  
   var Modulo_4_factor = 0;  
   var Modulo_5_factor = 0;  
   var Modulo_6_factor = 0;   
   var Modulo_7_factor = 0;   
   var Modulo_8_factor = 0; 
    
   var Modulo_10_factor = 0;   
   
  
  //////////////
   
  // si presiona la obcion basica asigna el valor 1 en a gestion de persona  
  if (Basico.checked == true) { 
    var Factor_Gestion_de_personas = Number(Gestion_de_personas_basico );
    //var Valor_Gestion_de_persona = 1;
    var modulo = 1;
    
    } 
  // si presiona la obcion avanzado asigna el valor 1.25 en a gestion de persona   
  if (Avanzado.checked == true) { 
    var Factor_Gestion_de_personas = Number( Gestion_de_personas_basico + Gestion_de_personas_avanzado );
    //var Valor_Gestion_de_persona = 1;
    var modulo = 2;
  }
    
  
  console.log ("modulos es " + modulo );  
    
  // asignacion de colaboradores
  if (N_colaboradores.length == 0){
     var Colaboradores_base = 0;
     var Costo_Base = 0;
     var Costo_Marginal = 0; 
  }
  
  else if (N_colaboradores >= 1 && N_colaboradores <= 100) {
     var Colaboradores_base = N_colaboradores;
     var Costo_Base = Costo_Base_De_1_A_100;
     var Costo_Marginal = (Costo_Marginal_De_1_A_100 * Colaboradores_base ); 
  } 
  else if (N_colaboradores >= 101 && N_colaboradores <= 500) {
     var Colaboradores_base = (N_colaboradores - 100) /*3.910*/ ;
     var Costo_Base = Costo_Base_De_101_A_500;
     var Costo_Marginal = (Costo_Marginal_De_101_A_500 * Colaboradores_base ); 
  }
  else if (N_colaboradores >= 501 && N_colaboradores <= 1000) {
     var Colaboradores_base = (N_colaboradores - 500)/* 13.229*/;
     var Costo_Base = Costo_Base_De_501_A_1000;
     var Costo_Marginal = (Costo_Marginal_De_501_A_1000 * Colaboradores_base );   
  } 
  else if (N_colaboradores >= 1001 && N_colaboradores <= 2500) {
     var Colaboradores_base = (N_colaboradores - 1000) /*23.101*/;
     var Costo_Base = Costo_Base_De_1001_A_2500 ;
     var Costo_Marginal = (Costo_Marginal_De_1001_A_2500 * Colaboradores_base );   
  } 
  else if (N_colaboradores >= 2501 && N_colaboradores <= 5000) {
     var Colaboradores_base = (N_colaboradores - 2500) /*52.333*/;
     var Costo_Base = Costo_Base_De_2501_A_5000;
     var Costo_Marginal = (Costo_Marginal_De_2501_A_5000 * Colaboradores_base ); 
  }
  else if (N_colaboradores >= 5001 && N_colaboradores <= 7500) {
     var Colaboradores_base = (N_colaboradores - 5000)/* 88.013*/;
     var Costo_Base = Costo_Base_De_5001_A_7500;
     var Costo_Marginal = (Costo_Marginal_De_5001_A_7500 * Colaboradores_base );   
  }  
  else if (N_colaboradores >= 7501 && N_colaboradores <= 10000) {
     var Colaboradores_base = (N_colaboradores - 7500)/* 121.453*/;
     var Costo_Base = Costo_Base_De_7501_A_10000;
     var Costo_Marginal = (Costo_Marginal_De_7501_A_10000 * Colaboradores_base );   
  }  
  else if (N_colaboradores >= 10001 && N_colaboradores <= 15000) {
     var Colaboradores_base = (N_colaboradores - 10000)/* 154.893*/;
     var Costo_Base = Costo_Base_De_10001_A_15000;
     var Costo_Marginal = Costo_Marginal_De_10001_A_15000 * Colaboradores_base;   
  }  
  else if (N_colaboradores >= 15001 && N_colaboradores <= 20000) {
     var Colaboradores_base = (N_colaboradores - 15000)/*221.773*/;
     var Costo_Base = Costo_Base_De_15001_A_20000;
     var Costo_Marginal = Costo_Marginal_De_15001_A_20000 * Colaboradores_base;    
  }  
  else {
     var Colaboradores_base = 20000;
     var Costo_Base = 344.85;
     var Costo_Marginal = 0.021; 
  } 
   
  //  //
  if (Basico.checked == true) { 
     var Modulo_0_valor = 1;
  } else {
     var Modulo_0_valor = 1;
  }
  
  if (Avanzado.checked == true) { 
     var Modulo_0_valor = 2;
  } else {
     var Modulo_0_valor = 1;
  }
  
   /*Number(Valor_Remuneraciones)*/  
  if (Modulo_1.parentElement.classList.contains('active')){
     var Modulo_1_valor = 1;
     var Modulo_1_factor = 1;
  } else {
     var Modulo_1_valor = 0;
     var Modulo_1_factor = 0;
  }
  
  /*Number(Valor_Firma_digital)*/  
  if (Modulo_3.parentElement.classList.contains('active')){
     var Modulo_3_valor = 1;
     var Modulo_3_factor = 0.26; 
  } else {
     var Modulo_3_valor = 0;
     var Modulo_3_factor = 0;
  }
  
  /*Number(Valor_Comunicacion_y_recon)*/  
  if (Modulo_4.parentElement.classList.contains('active')){
     var Modulo_4_valor = 1;
     var Modulo_4_factor = 0.28;
  } else {
     var Modulo_4_valor = 0;
     var Modulo_4_factor = 0;
  }
  
  /*Number(Valor_Gestion_de_desempeno)*/   
  if (Modulo_5.parentElement.classList.contains('active')){
     var Modulo_5_valor = 1;
     var Modulo_5_factor = 0.6; 
  } else {
     var Modulo_5_valor = 0;
     var modulo_5_factor = 0;
  }
  
  /*Number(Valor_Beneficios)*/
  if (Modulo_6.parentElement.classList.contains('active')){
     var Modulo_6_valor = 1;
     var Modulo_6_factor = 0.3; 
  } else {
     var Modulo_6_valor = 0;
     var Modulo_6_factor = 0;
  }

  /*Number(Valor_Seleccion)*/  
  if (Modulo_7.parentElement.classList.contains('active')){
     var Modulo_7_valor = 1;
     var Modulo_7_factor = 0.6;
  } else {
     var Modulo_7_valor = 0;
     var Modulo_7_factor = 0;
  }
  
  /*Number(Valor_Encuestas)*/  
  if (Modulo_8.parentElement.classList.contains('active')){
     var Modulo_8_valor = 1;
     var Modulo_8_factor = 0.2;  
  } else {
     var Modulo_8_valor = 0;
     var Modulo_8_factor = 0;
  }

  /*Capacitaciones*/  
  if (Modulo_10.parentElement.classList.contains('active')){
     var Modulo_10_valor = 1;
     var Modulo_10_factor = 0.62; 
  } else {
     var Modulo_10_valor = 0;
     var Modulo_10_factor = 0;
  }
  
  //// Addons ///// 
  
  /*Workflows*/   
  if (Addons_1.parentElement.classList.contains('active')){
     var Addons_1_valor = 1;
     var Addons_1_factor = 0.1; 
  } else {
     var Addons_1_valor = 0;
     var Addons_1_factor = 0;
  }
  
  /*SAML*/   
  if (Addons_5.parentElement.classList.contains('active')){
     var Addons_5_valor = 1;
     var Addons_5_factor = 0.1;  
  } else {
     var Addons_5_valor = 0;
     var Addons_5_factor = 0;
  }

  /*API*/   
  if (Addons_7.parentElement.classList.contains('active')){
     var Addons_7_valor = 1;
     var Addons_7_factor = 0.1;  
  } else {
     var Addons_7_valor = 0;
     var Addons_7_factor = 0;
  }
  if (Addons_8.parentElement.classList.contains('active')){
     var Addons_8_valor = 1;
     var Addons_8_factor = 0.8;
  } else {
     var Addons_8_valor = 0;
     var Addons_8_factor = 0;
  }
        
  var Suma_de_factores  = ( Factor_Gestion_de_personas 
                           + Modulo_1_factor 
                            
                           + Modulo_3_factor  
                           + Modulo_4_factor  
                           + Modulo_5_factor  
                           + Modulo_6_factor   
                           + Modulo_7_factor   
                           + Modulo_8_factor 
                            
                           + Modulo_10_factor   
                           
                          
                           + Addons_1_factor   
                           
                           
                          
                           + Addons_5_factor   
                           
                           + Addons_7_factor 
                            + Addons_8_factor  
                           
                           
                          
                          
                            
                           
                           
                          );
    
  var Suma_de_modulos   = ( Number(Modulo_0_valor) 
                           + Number(Modulo_1_valor)  
                           
                           + Number(Modulo_3_valor) 
                           + Number(Modulo_4_valor)  
                           + Number(Modulo_5_valor)  
                           + Number(Modulo_6_valor)  
                           + Number(Modulo_7_valor)  
                           + Number(Modulo_8_valor)  
                           
                           + Number(Modulo_10_valor)  
                           
                           
                         
                          
                                               
                          ); 
  
  
   var Suma_de_addoms   = (
                           + Number(Addons_1_valor) 
                             
                           
                          
                           + Number(Addons_5_valor)  
                          
                           + Number(Addons_7_valor) 
                            + Number(Addons_8_valor)  
                           
                           
                          
                           
                            
                                                  
                          );   
      
  // descuento por cantidad de modulos
  if (Suma_de_modulos >= 16) {
    var descuento_Suma_de_modulos = 0.15;
  }
  else if (Suma_de_modulos == 15) {
    var descuento_Suma_de_modulos = 0.14;
  }
  else if (Suma_de_modulos == 14) {
    var descuento_Suma_de_modulos = 0.13;
  }
  else if (Suma_de_modulos == 13) {
    var descuento_Suma_de_modulos = 0.12;
  }
  else if (Suma_de_modulos == 12) {
    var descuento_Suma_de_modulos = 0.11;
  }  
  else if (Suma_de_modulos == 11) {
    var descuento_Suma_de_modulos = 0.10;
  }
  else if  (Suma_de_modulos == 10){
      var descuento_Suma_de_modulos = 0.10; 
  }  
  else if(Suma_de_modulos == 9 ){
      var descuento_Suma_de_modulos = 0.10; 
  }  
  else if(Suma_de_modulos == 8 ){
      var descuento_Suma_de_modulos = 0.095; 
  } 
  else if(Suma_de_modulos == 7){
      var descuento_Suma_de_modulos = 0.09; 
  } 
  else if(Suma_de_modulos == 6 ){
      var descuento_Suma_de_modulos = 0.08; 
  }   
  else if(Suma_de_modulos == 5 ){
      var descuento_Suma_de_modulos = 0.07;
  } 
  else if(Suma_de_modulos == 4 ){
      var descuento_Suma_de_modulos = 0.05; 
  }
      
  
  else if(Suma_de_modulos <= 3 ){
      var descuento_Suma_de_modulos = 0.0; 
  } 
  else {
      var descuento_Suma_de_modulos = 0.0;
  } 
  
  var resultado_modulos_factores = (Suma_de_factores * (1 - descuento_Suma_de_modulos) ) ;  
  let n = resultado_modulos_factores; 
    
  var Subtotal = ( Costo_Base + Costo_Marginal );   
  var total = ( Subtotal * n  );  
   
  //costo minimo por modulos //
  var precio_minimo = ( 320000 + ( 20000 * ( Suma_de_modulos + Suma_de_addoms - 1) ));
    
  if (total <= precio_minimo){
     var total_costo3 = precio_minimo ;
    }
  else {
     var total_costo3 = total ;
    }
  
  console.log ("Suma_de_factores es " + Suma_de_factores );  
  console.log ("Suma_de_modulos es " + Suma_de_modulos );   
  document.getElementById("resultado").innerHTML =  "$" + Math.ceil(total_costo3).toLocaleString(undefined, {maximumFractionDigits: 0})
  document.getElementById("resultado2").innerHTML =  "$" + Math.ceil(total_costo3).toLocaleString(undefined, {maximumFractionDigits: 0})    
  //console.log ("Colaboradores_base es " + Colaboradores_base );  
  console.log ("Subtotal  es " + Subtotal  );  
  console.log ("precio_minimo es " + precio_minimo );  
  console.log ("total_costo3 es " + total_costo3 );
   showDiscount(Suma_de_modulos, total_costo3)
      }, 850)
  
}

// Get the container element
var btnContainer = document.getElementById("myDIV");

var btns = btnContainer.getElementsByClassName("btn");

for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.querySelectorAll("#myDIV .active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// Part 5

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "85px";
    }
  });
}

// Part 6

function mostra1() {
    var element = document.getElementById("info1");
    var ele = document.getElementById("in1");  
    element.classList.toggle("mostra");
    ele.classList.toggle("mostra");
 }  
 function mostra2() {
    var element = document.getElementById("info2");
    var ele = document.getElementById("in2");
    element.classList.toggle("mostra");
    ele.classList.toggle("mostra");
 }

// Pop-ups

function openPopup(el) {
    $('.popup').hide();
    $('#' + el).fadeIn(200);   
}
function closePopup() {
     $('.popup').fadeOut(300);
}

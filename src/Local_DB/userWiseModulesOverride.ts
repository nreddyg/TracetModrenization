export const modulesOverride = {
     "password policy": {
      "action": (module) => {  // Hide this module
        return;
      }
    },
    "license details": {
      "action": (module) => {  // Hide this module
        return;
      }
    },
    "parameters": {
      "action": (module) => {  // Hide this module
        return;
      }
    },
    "email notification": {
      "action": (module) => {  // Hide this module
        return;
      }
    },
    "user roles": {
      "action": (module) => {  // Hide this module
        return;
      }
    },
    "procurement settings": {
      "action": (module) => {  // Hide this module
        return;
      }
    },
    "barcode/qr code profile setup":{
      "action": (module) => {  // Hide this module
        return;
      }
    },
    "copy masters": {
      "action": (module) => {  // Hide this module
        return;
      }
    },
     "create work order": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
     "manage work order": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
     "print asset barcodes": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
     "expiry tracker": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
     "custom notification": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
     "draft assets": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
     "purchase order": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
     "document number generation":{
      "action": (module) => {  // Hide this module
        return;
      }},
     "manage orders": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
    //  "software assets": {
    //    "action": (module) => {  // Hide this module
    //      return;
    //    }
    //  },
     "mis reports": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
       "cwip": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
        "utilities": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
"procurement": {
       "action": (module) => {  // Hide this module
         return;
       }
     },
     "fixed assets": {
        "action": (module,isParent) => {
        if(isParent)return(module)
        return;
          }
     },
      "physical verification": {
         "action": (module,isParent) => {
        if(isParent)return(module)
        return;
     }
     },
      "consumables": {
       "action": (module,isParent) => {
        if(isParent)return(module)
        return;
          } 
     },
      "depreciation": {
      "action": (module,isParent) => {
        if(isParent)return(module)
        return;
          } 
     },
     "let out(issue)/let in(return)":{
       "action": (module) => {  // Hide this module
         return;
       }
     },
       "hierarchy configuration":{
       "action": (module) => {  // Hide this module
         return;
       }
     },

     "additional field configuration":{
       "action": (module) => {  // Hide this module
         return;
       }
     },

     "service desk": {
       "action": (module) => {  // Add few childrren
        let data=  module.Children 
        // data.forEach(element => {
        // element.ModuleName
        // });
 
        const index = data.findIndex(obj => obj.ModuleName === "All Service Requests"); // find the index of target object

if (index !== -1) {
  data.splice(index + 1, 0,    {
             "ModuleId": 2,
             "ModuleName": "Ticket Progress Dashboard"
           }); // insert newObj after it
}
  
         return module;
       },
     },
   

     "reports": {
       "action": (module) => {  // Remove children
         delete module.Children;
         return module;
       }
     }
   }
 
 
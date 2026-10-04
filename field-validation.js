import {dimensionRange} from './model.js';

export function parseFiniteDecimal(raw,badInput=false){
 if(badInput||typeof raw!=='string'||!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw.trim()))return null;
 const value=Number(raw);
 return Number.isFinite(value)?value:null;
}

export function numericError(raw,badInput=false,dimension){
 if(badInput)return 'Enter a finite decimal number. Scientific notation is not enabled in this application.';
 if(raw==='')return null;
 const value=parseFiniteDecimal(raw,badInput);
 if(value===null)return 'Enter a finite decimal number. Scientific notation is not enabled in this application.';
 const {min,max}=dimensionRange(dimension);
 if(value<min||value>max)return `Enter a value from ${min} to ${max}. Values outside this range are not accepted.`;
 return dimension?.integerOnly===true&&!Number.isInteger(value)?'This Dimension requires an integer value. The recorded value is unchanged.':null;
}

export function showNumericError(input,message){
 const field=input.closest('.value-field'),error=field?.querySelector('.field-error');
 if(!error)return;
 error.textContent=message||'';
 error.hidden=!message;
 input.setAttribute('aria-invalid',message?'true':'false');
 field.classList.toggle('invalid',Boolean(message));
}

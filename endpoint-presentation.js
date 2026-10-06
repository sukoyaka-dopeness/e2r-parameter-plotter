import {fmt} from './model.js';

export function hasAuthoredEndpointLabels(dimension){
 return dimension?.endpointLabelsPresent===true;
}

export function endpointText(dimension,side,format=fmt){
 const low=side==='low',value=format(low?dimension?.min:dimension?.max,dimension);
 if(!hasAuthoredEndpointLabels(dimension))return value;
 return low?dimension.low:dimension.high;
}

export function endpointRangeText(dimension,format=fmt){
 const min=format(dimension?.min,dimension),max=format(dimension?.max,dimension);
 return hasAuthoredEndpointLabels(dimension)
  ?`${dimension.low} · ${min} → ${max} · ${dimension.high}`
  :`${min} → ${max}`;
}

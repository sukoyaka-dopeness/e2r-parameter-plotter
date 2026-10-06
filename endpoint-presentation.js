import {fmt} from './model.js';

export function hasAuthoredEndpointLabels(dimension){
 return hasAuthoredEndpointLabel(dimension,'low')||hasAuthoredEndpointLabel(dimension,'high');
}

export function hasAuthoredEndpointLabel(dimension,side){
 const label=side==='low'?dimension?.low:dimension?.high;
 return dimension?.endpointLabelsPresent===true&&typeof label==='string'&&label.length>0;
}

export function endpointText(dimension,side,format=fmt){
 const low=side==='low',value=format(low?dimension?.min:dimension?.max,dimension);
 return hasAuthoredEndpointLabel(dimension,side)?(low?dimension.low:dimension.high):value;
}

export function endpointBoundaryText(dimension,side,format=fmt){
 const low=side==='low',value=format(low?dimension?.min:dimension?.max,dimension);
 if(!hasAuthoredEndpointLabel(dimension,side))return value;
 return low?`${dimension.low} · ${value}`:`${value} · ${dimension.high}`;
}

export function endpointRangeText(dimension,format=fmt){
 return `${endpointBoundaryText(dimension,'low',format)} → ${endpointBoundaryText(dimension,'high',format)}`;
}

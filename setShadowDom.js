

let shadowDom = false;

function useShadowDom(){
    shadowDom = true;
}


function isShadowDom(){
    return shadowDom;
}

module.exports = {
    useShadowDom: useShadowDom,
    isShadowDom: isShadowDom,
}
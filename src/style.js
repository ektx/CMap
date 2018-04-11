export function setDPIFontSize (style, DPI) {
    
    let reSet = (font) => {
        let fontArr = font.match(/([\d\.]+)(px|em)/)
        let szie = parseFloat(fontArr[1])
        let unit = fontArr[2]
        font = font.replace(fontArr[0], szie * DPI + unit)
        return font
    }

    if (!style) return

    Object.keys(style).forEach(val => {
        if (val === 'font') {
            style[val] = reSet(style[val])
        }
    })

    return style
}

export function setCtxState (styleOption, ctx) {
    ctx.beginPath()

    for (let i in styleOption) {
        ctx[i] = styleOption[i]
    }	
    return ctx
}
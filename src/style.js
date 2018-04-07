export function setDPIFontSize (font) {
    let fontArr = font.match(/([\d\.]+)(px|em)/)
    let szie = parseFloat(fontArr[1])
    let unit = fontArr[2]
    font = font.replace(fontArr[0], szie * this.DPI + unit)
    return font
}

export function setCtxState (styleOption, ctx) {
    ctx.save()
    ctx.beginPath()

    for (let i in styleOption) {
        ctx[i] = styleOption[i]
    }	
    return ctx
}
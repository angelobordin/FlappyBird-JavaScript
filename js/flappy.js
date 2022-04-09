function newElement(tagName, className) {
    const element = document.createElement(tagName)
    element.className = className
    return element
}
 
function Pipe(superior = false) {
    this.barreira = newElement('div' , 'barreira')
 
    const ponta = newElement('div', 'ponta')
    const corpo = newElement('div', 'corpo')
    this.barreira.appendChild(superior ? corpo : ponta)
    this.barreira.appendChild(superior ? ponta : corpo)
 
    this.setHeight = height => corpo.style.height = `${height}px`
}
 
function PairPipe(height, opening, x){
    this.parDeBarreiras = newElement('div', 'par-de-barreiras')
 
    this.superior = new Pipe(true);
    this.inferior = new Pipe(false);
 
    this.parDeBarreiras.appendChild(this.superior.barreira)
    this.parDeBarreiras.appendChild(this.inferior.barreira) 
 
    this.sorterOpening = () => {
        const topHeight = Math.random() * (height - opening)
        const lowerHeight = height - opening - topHeight
        this.superior.setHeight(topHeight)
        this.inferior.setHeight(lowerHeight)
    }
 
    this.getX = () => parseInt(this.parDeBarreiras.style.left.split('px')[0])
    this.setX = x => this.parDeBarreiras.style.left = `${x}px`
    this.getWidth = () => this.parDeBarreiras.clientWidth
 
    this.sorterOpening()
    this.setX(x)
}
 
//const b = new PairPipe(700, 200, 400)
//document.querySelector('[wm-flappy]').appendChild(b.parDeBarreiras),
 
function Pipes(height, width, opening, space, notifyPoint) {
    this.pairs = [
        new PairPipe(height, opening, width),
        new PairPipe(height, opening, width + space),
        new PairPipe(height, opening, width + space * 2),
        new PairPipe(height, opening, width + space * 3)
    ]
 
    const deslocamento = 3
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - deslocamento)
 
            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.sorterOpening()
            }
 
            const middle = width / 2
            const exceededMiddle = pair.getX() + deslocamento >= middle
                && pair.getX() < middle
            if(exceededMiddle) notifyPoint()
 
        })
    }
}
 
function Passaro(alturaJogo) {
    let voando = false
 
    this.Passaro = newElement('img', 'passaro')
    this.Passaro.src = 'imgs/passaro.png'
    
    this.getY = () => parseInt(this.Passaro.style.bottom.split('px')[0])
    this.setY = y => this.Passaro.style.bottom = `${y}px`
    
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false
 
    this.animate = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.Passaro.clientHeight
 
        if(novoY <= 0) {
            this.setY(0)
        }else if(novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        }else {
            this.setY(novoY)
        }
    }
 
    this.setY(alturaJogo / 2)
}
 
function Progresso() {
    this.elemento = newElement('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}
 
function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()
 
    const horizontal = a.left + a.width >= b.left 
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top 
        && b.top + b.height >= a.top
    
    return horizontal && vertical
}
 
function colidiu(passaro, barreiras) {
     let colidiu = false
     barreiras.pairs.forEach(parDeBarreiras => {
         if(!colidiu) {
             const superior = parDeBarreiras.superior.barreira
             const inferior = parDeBarreiras.inferior.barreira
             colidiu = estaoSobrepostos(passaro.Passaro, superior) 
                || estaoSobrepostos(passaro.Passaro, inferior)
         }
     })
	 return colidiu
}
 
function FlappyBird() {
    let pontos = 0
 
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const alturaJogo = areaDoJogo.clientHeight
    const larguraJogo = areaDoJogo.clientWidth
 
    const progresso = new Progresso()
    const barreiras = new Pipes(alturaJogo, larguraJogo, 200, 400,
        () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(alturaJogo)
 
    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.Passaro)
    barreiras.pairs.forEach(pair => areaDoJogo.appendChild(pair.parDeBarreiras )) 
 
    this.start = () => {    
        // loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animate()
            passaro.animate()
 
            if(colidiu(passaro, barreiras)) {
                clearInterval(temporizador)
            }
        }, 20)
    }
}
 
new FlappyBird().start();
 
/* const barreiras = new Pipes(700, 1200, 200, 400);
const passaro = new Passaro(700)
const areaDoJogo = document.querySelector('[wm-flappy]')
 
 
areaDoJogo.appendChild(passaro.elemento)
areaDoJogo.appendChild(new Progresso().elemento)
barreiras.pairs.forEach(par => areaDoJogo.appendChild(par.parDeBarreiras))
setInterval(() => {
    barreiras.animate()
    passaro.animate()
}, 20)
 */

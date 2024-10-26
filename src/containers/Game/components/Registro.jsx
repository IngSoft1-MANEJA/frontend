import React from 'react'
import './Registro.css'

export const Registro = () => {
  return (
    <div className="registro-container absolute h-1/2 -translate-y-1/2 left-5 top-1/2 z-50 w-60 p-1 justify-center">
        <div className="registro-container-inner bg-base-200 flex flex-col h-full w-full">
            <div className="chatbox overflow-auto flex flex-col-reverse">
                <div className="chat chat-start text-sm">
                    <div className="chat-header pb-1">
                        Jugador 1
                    </div>
                    <div className="chat-bubble">Switcher game!</div>
                </div>
                <span className="chat-divider text-sm mb-2 mt-2 pt-1 pb-1 pl-4 text-left bg-base-300">Jugador 2 jugo movimiento L</span>
                <div className="chat chat-start text-sm">
                    <div className="chat-header pb-1">
                        Jugador 1
                    </div>
                    <div className="chat-bubble">This is testing.</div>
                </div>
                <p className="chat-divider text-sm mb-2 mt-2 pt-1 pb-1 pl-4 text-left bg-base-300 tex">Jugador 1 jugo figura INVERTED SNAKE</p>
                <p className="chat-divider text-sm mb-2 mt-2 pt-1 pb-1 pl-4 text-left bg-base-300">Jugador 1 jugo movimiento LINE BORDER</p>
                <div className="chat chat-end text-sm">
                    <div className="chat-header pb-1">
                        Jugador 2
                    </div>
                    <div className="chat-bubble">Chat testing text.</div>
                </div>
            </div>
            <textarea className="textarea resize-none mt-2" placeholder="Comenta"></textarea>
        </div>
    </div>
  )
}

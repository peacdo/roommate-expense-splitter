import { useState, useEffect, createContext, useContext } from "react"

const ToastContext = createContext({})

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        const timeouts = []
        toasts.forEach((toast) => {
            if (toast.duration !== Infinity) {
                const timeout = setTimeout(() => {
                    setToasts((toasts) => toasts.filter((t) => t.id !== toast.id))
                }, toast.duration || 5000)
                timeouts.push(timeout)
            }
        })
        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout))
        }
    }, [toasts])

    function toast({ title, description, duration = 5000 }) {
        setToasts((toasts) => [
            ...toasts,
            { id: Math.random().toString(), title, description, duration },
        ])
    }

    return (
        <ToastContext.Provider value={{ toast, toasts }}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

type ToastType = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastType & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        toastTimeouts.forEach((_, id) => {
          if (id === toastId) {
            toastTimeouts.delete(id)
          }
        })

        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        }
      }

      return {
        ...state,
        toasts: [],
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        }
      }
      return {
        ...state,
        toasts: [],
      }
    default:
      return state
  }
}

export function useToast() {
  const [state, setState] = useState<State>({ toasts: [] })

  useEffect(() => {
    const handleDismiss = (toast: ToasterToast) => {
      setState((prevState) => ({
        ...prevState,
        toasts: prevState.toasts.filter((t) => t.id !== toast.id),
      }))
    }

    state.toasts.forEach((toast) => {
      if (!toast.id || toastTimeouts.has(toast.id)) return

      const timeout = setTimeout(() => {
        handleDismiss(toast)
      }, TOAST_REMOVE_DELAY)

      toastTimeouts.set(toast.id, timeout)
    })

    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout))
      toastTimeouts.clear()
    }
  }, [state.toasts])

  function toast({
    title,
    description,
    action,
    variant,
  }: {
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
    variant?: "default" | "destructive"
  }) {
    const id = genId()

    const newToast: ToasterToast = {
      id,
      title,
      description,
      action,
      variant,
    }

    setState((prevState) => ({
      ...prevState,
      toasts: [newToast, ...prevState.toasts].slice(0, TOAST_LIMIT),
    }))

    return {
      id,
      dismiss: () => {
        setState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((t) => t.id !== id),
        }))
      },
      update: (props: ToastProps) => {
        setState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.map((t) => (t.id === id ? { ...t, ...props } : t)),
        }))
      },
    }
  }

  return {
    toast,
    dismiss: (toastId?: string) => {
      setState((prevState) => ({
        ...prevState,
        toasts: prevState.toasts.filter((t) => (toastId ? t.id !== toastId : false)),
      }))
    },
    toasts: state.toasts,
  }
}


"use client"

import React from "react"

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryInner>
      {children}
    </ErrorBoundaryInner>
  )
}

class ErrorBoundaryInner extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Algo salió mal</h2>
            <p className="text-muted-foreground mt-2">
              Por favor, recargá la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground mt-4 rounded-md px-4 py-2"
            >
              Recargar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

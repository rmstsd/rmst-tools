export function invoke<T = any>(channel: string, args?: unknown): Promise<T> {
  return window.api.invoke<T>(channel, args)
}

export function notifyError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error || '操作失败')
}

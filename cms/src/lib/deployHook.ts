import type { PayloadRequest } from 'payload'

type TriggerDeployHookArgs = {
  reason: string
  req: PayloadRequest
}

let lastTriggerAt = 0

export async function triggerDeployHook({ reason, req }: TriggerDeployHookArgs) {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL

  if (!hookUrl) return

  const now = Date.now()

  if (now - lastTriggerAt < 30000) {
    req.payload.logger.info(`Skipped Vercel deploy hook debounce: ${reason}`)
    return
  }

  lastTriggerAt = now

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
    })

    if (!response.ok) {
      req.payload.logger.error(`Vercel deploy hook failed (${response.status}): ${reason}`)
      return
    }

    req.payload.logger.info(`Triggered Vercel deploy hook: ${reason}`)
  } catch (error) {
    req.payload.logger.error({ err: error }, `Vercel deploy hook error: ${reason}`)
  }
}

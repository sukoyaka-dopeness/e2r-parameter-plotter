// A rejected workspace write is sticky for the lifetime of this page.
// Reloading is the recovery boundary that loads the latest persisted revision.
export function createWorkspaceWriteGate() {
  let refusal = null;
  let tail = Promise.resolve();

  return {
    get refusal() { return refusal; },
    retryExplicitly() { refusal = null; },
    run(attempt) {
      const operation = tail.then(async () => {
        // Recheck only after earlier attempts finish. Calls already awaiting
        // Web Locks must observe a refusal before they can start persistence.
        if (refusal) return { ok: false, priorRefusal: refusal };

        let result;
        try {
          result = await attempt();
        } catch (error) {
          result = {
            ok: false,
            coordinationError: true,
            reason: `Cross-tab safety could not be verified. ${error?.message || ''}`.trim()
          };
        }

        if (result?.ok === false && !result.cancelled) refusal = result;
        return result;
      });
      tail = operation.then(() => undefined, () => undefined);
      return operation;
    }
  };
}

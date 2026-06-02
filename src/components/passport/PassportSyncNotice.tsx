export function PassportSyncNotice() {
  return (
    <section className="rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/36 p-4 text-sm leading-7 text-[#5f4635] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
        Local Save Notice
      </p>
      <p className="mt-2">
        My Cup is saved on this device only for now. LINE Login and account sync
        are planned later, but are not connected in this phase.
      </p>
    </section>
  );
}

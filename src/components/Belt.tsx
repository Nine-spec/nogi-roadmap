import { motion } from 'framer-motion';
import { stripes } from '../lib/stats';

/** A belt drawn with divs: white belt with a black rank bar and up to 4 stripes; turns blue at 100 %. */
export function Belt({ progress }: { progress: number }) {
  const blue = progress >= 1;
  const n = stripes(progress);
  return (
    <div className="relative w-full max-w-md" aria-label={blue ? 'Ceinture bleue' : `Ceinture blanche, ${n} barrette(s)`}>
      <motion.div
        initial={false}
        animate={{ backgroundColor: blue ? '#2563EB' : '#E8ECF2' }}
        transition={{ duration: 0.8 }}
        className="relative flex h-11 items-stretch overflow-hidden rounded-md shadow-[0_10px_30px_-10px_rgba(37,99,235,.6)]"
      >
        {/* stitching */}
        <div className="pointer-events-none absolute inset-x-0 top-[30%] border-t border-dashed border-black/15" />
        <div className="pointer-events-none absolute inset-x-0 top-[70%] border-t border-dashed border-black/15" />
        <div className="flex-1" />
        <div className={`relative mr-8 flex w-28 items-center justify-start gap-1.5 px-2 ${blue ? 'bg-black' : 'bg-[#111]'}`}>
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{ opacity: i < n ? 1 : 0.15, scaleY: i < n ? 1 : 0.85 }}
              className="h-[80%] w-3 rounded-[2px] bg-white"
            />
          ))}
        </div>
      </motion.div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-400">
        <span>{blue ? 'Ceinture bleue' : 'Ceinture blanche'}</span>
        <span className="num">{blue ? '🎉' : `${n}/4 barrettes`}</span>
      </div>
    </div>
  );
}

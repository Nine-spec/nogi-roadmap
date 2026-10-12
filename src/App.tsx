import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Achievement } from './data/achievements';
import { beltCelebration, burst, playSfx } from './lib/fx';
import { AppStoreProvider, useStore } from './store/AppStore';
import { Achievements } from './components/Achievements';
import { AGame } from './components/AGame';
import { Home } from './components/Home';
import { Journal } from './components/Journal';
import { BottomBar, NAV, Sidebar, type Page } from './components/Nav';
import { AchievementToasts, BlueBeltModal, LevelUpModal } from './components/Overlays';
import { Roadmap } from './components/Roadmap';
import { Settings } from './components/Settings';
import { Tips } from './components/Tips';
import { Videos } from './components/Videos';

const pageFromHash = (): Page => {
  const h = (typeof location !== 'undefined' ? location.hash.slice(1) : '') as Page;
  return NAV.some((n) => n.id === h) ? h : 'home';
};

function Shell() {
  const store = useStore();
  const { s, level, unlocked, progress, markAchievementsSeen, markBeltCelebrated } = store;
  const [page, setPage] = useState<Page>(pageFromHash);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Achievement[]>([]);
  const [beltOpen, setBeltOpen] = useState(false);
  const prevLevel = useRef(level.level);

  const go = (p: Page) => {
    setPage(p);
    try {
      history.replaceState(null, '', p === 'home' ? location.pathname + location.search : `#${p}`);
    } catch {
      /* navigation sans hash */
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Level-up: celebrate normal progress; big jumps come from loading data, so skip those.
  useEffect(() => {
    const diff = level.level - prevLevel.current;
    if (diff > 0 && diff <= 6) {
      setLevelUp(level.level);
      burst();
      playSfx('level', s.sound);
    }
    prevLevel.current = level.level;
  }, [level.level, s.sound]);

  // Achievement toasts for newly unlocked ones.
  useEffect(() => {
    const fresh = unlocked.filter((a) => !s.seenAchievements.includes(a.id));
    if (!fresh.length) return;
    setToasts((t) => [...t, ...fresh.filter((f) => !t.some((x) => x.id === f.id))]);
    markAchievementsSeen(fresh.map((a) => a.id));
    playSfx('achievement', s.sound);
    fresh.forEach((a) => setTimeout(() => setToasts((t) => t.filter((x) => x.id !== a.id)), 4500));
  }, [unlocked, s.seenAchievements, s.sound, markAchievementsSeen]);

  // Blue belt: confetti once.
  useEffect(() => {
    if (progress >= 1 && !s.celebratedBlueBelt) {
      setBeltOpen(true);
      beltCelebration();
      playSfx('belt', s.sound);
      markBeltCelebrated();
    }
  }, [progress, s.celebratedBlueBelt, s.sound, markBeltCelebrated]);

  const content = {
    home: <Home go={go} />,
    roadmap: <Roadmap />,
    agame: <AGame />,
    journal: <Journal />,
    tips: <Tips />,
    videos: <Videos />,
    achievements: <Achievements />,
    settings: <Settings />,
  }[page];

  return (
    <div className="app-bg min-h-screen lg:flex">
      <Sidebar page={page} go={go} />
      <main className="min-w-0 flex-1 px-4 pb-32 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <BottomBar page={page} go={go} />
      <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />
      <BlueBeltModal open={beltOpen} onClose={() => setBeltOpen(false)} />
      <AchievementToasts items={toasts} onDone={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <Shell />
    </AppStoreProvider>
  );
}


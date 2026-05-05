// Purpose: app boot. Callers: HTML pages. Deps: data/cart/ui/audio/pages/navigation. API: none. Side effects: starts audio, page render, soft navigation.
document.addEventListener('DOMContentLoaded', () => {
  initAudioPlayer();
  initCommonPage();
  initPageSpecific();
  initSoftNavigation();
});

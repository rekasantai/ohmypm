// Layer 5: Application Entrypoint — exposes UI handlers to DOM onclick attributes and boots app.
import {
    advanceToNextLevel,
    approveRiskRegister,
    assignArtisanToTask,
    authorizeProjectCharter,
    bootApp,
    closeMobileSheet,
    confirmResetProgress,
    decomposeWorkPackage,
    focusDependencyTask,
    handleArtisanCardTap,
    handleCharterBucketClick,
    handlePrimaryCTA,
    handleViewportChange,
    handleWbsBucketClick,
    openMobileArtisanSheet,
    openTaskAssignPicker,
    pullAndAssignTask,
    pullTaskToSprint,
    replayCurrentLevel,
    requestLevelSwitch,
    requestRestartCurrentLevel,
    resolveChapterEvent,
    returnTaskToBacklog,
    selectCareerChapter,
    selectRetro,
    selectRiskStrategy,
    selectStatement,
    selectWbsCard,
    startWorkday,
    swapTaskArtisan,
    switchLevel,
    setAgileMobileTab,
    stepCharterDeck,
    stepRiskDeck,
    stepWbsDeck,
    toggleCompletedWp,
    toggleContextBanner,
    toggleFastTurn,
    toggleGuidanceExpand,
    toggleMobileSiteDrawer,
    toggleMute,
    toggleRestBreak,
    toggleTaskCrash
} from './core/engine.js';
import {
    changeTutorialStep,
    closeCareerMap,
    closeConfirm,
    closeTutorialModal,
    handleGlobalKeydown,
    openCareerMap,
    openTutorialModal,
    startChapterFromIntro
} from './ui/modals.js';
import { getChapterCfg, store } from './core/state.js';
import { isMobileViewport } from './ui/feedback.js';
import { initMobileGestures } from './ui/gestures.js';

const WINDOW_EXPORTS = {
    openTutorialModal,
    closeTutorialModal,
    changeTutorialStep,
    closeConfirm,
    openCareerMap,
    closeCareerMap,
    selectCareerChapter,
    startChapterFromIntro,
    requestLevelSwitch,
    requestRestartCurrentLevel,
    confirmResetProgress,
    switchLevel,
    selectStatement,
    handleCharterBucketClick,
    authorizeProjectCharter,
    selectWbsCard,
    handleWbsBucketClick,
    decomposeWorkPackage,
    openTaskAssignPicker,
    assignArtisanToTask,
    swapTaskArtisan,
    toggleTaskCrash,
    toggleRestBreak,
    pullTaskToSprint,
    returnTaskToBacklog,
    focusDependencyTask,
    handlePrimaryCTA,
    startWorkday,
    resolveChapterEvent,
    advanceToNextLevel,
    replayCurrentLevel,
    selectRetro,
    toggleMute,
    toggleFastTurn,
    toggleMobileSiteDrawer,
    handleArtisanCardTap,
    openMobileArtisanSheet,
    closeMobileSheet,
    toggleContextBanner,
    toggleGuidanceExpand,
    stepCharterDeck,
    stepRiskDeck,
    stepWbsDeck,
    setAgileMobileTab,
    toggleCompletedWp,
    pullAndAssignTask,
    selectRiskStrategy,
    approveRiskRegister
};

if (typeof window !== 'undefined') {
    Object.assign(window, WINDOW_EXPORTS);

    window.addEventListener('resize', handleViewportChange);
    if (window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
        window.visualViewport.addEventListener('resize', handleViewportChange);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('keydown', (e) => {
        handleGlobalKeydown(e, { closeMobileSheetFn: closeMobileSheet });
    });

    const bootWithGestures = () => {
        bootApp();
        initMobileGestures({
            isMobile: isMobileViewport,
            isExecuting: () => Boolean(store.state && store.state.isExecuting),
            getMode: () => getChapterCfg().mode,
            getAgileTab: () => store.ui.agileMobileTab,
            onStepCharter: stepCharterDeck,
            onStepWbs: stepWbsDeck,
            onStepRisk: stepRiskDeck,
            onSetAgileTab: setAgileMobileTab,
            onCloseSheet: closeMobileSheet
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootWithGestures);
    } else {
        bootWithGestures();
    }
}

export { bootApp };

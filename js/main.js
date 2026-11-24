// Layer 5: Application Entrypoint — exposes UI handlers to DOM onclick attributes and boots app.
import {
    advanceToNextLevel,
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
    pullTaskToSprint,
    replayCurrentLevel,
    requestLevelSwitch,
    requestRestartCurrentLevel,
    resolveChapterEvent,
    returnTaskToBacklog,
    selectCareerChapter,
    selectRetro,
    selectStatement,
    selectWbsCard,
    startWorkday,
    swapTaskArtisan,
    switchLevel,
    toggleContextBanner,
    toggleFastTurn,
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
    toggleContextBanner
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootApp);
    } else {
        bootApp();
    }
}

export { bootApp };

import Controller from 'EnvServices/Controller';
import EventBus from '@/services/EventBus';

function close(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
        Controller.closeSlide();
    }
}

function move(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (e.key === 'ArrowLeft') {
            Controller.prevSlide();
        } else {
            Controller.nextSlide();
        }
    }
}

function deleteSlide(e) {
    if (e.key === 'Delete') {
        e.preventDefault();
        Controller.deleteSlide();
    }
}

function undoDeleteSlide(e) {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        Controller.undoDeleteSlide();
    }
}

function removeAll() {
    window.removeEventListener('keydown', close);
    window.removeEventListener('keydown', move);
    window.removeEventListener('keydown', deleteSlide);
    window.removeEventListener('keydown', undoDeleteSlide);
}

function addAll() {
    removeAll();
    window.addEventListener('keydown', close);
    window.addEventListener('keydown', move);
    window.addEventListener('keydown', deleteSlide);
    window.addEventListener('keydown', undoDeleteSlide);
}

EventBus.$on(EventBus.events.CURRENT_SLIDE_CHANGED, (slide) => {
    window.removeEventListener('keydown', close);
    window.removeEventListener('keydown', deleteSlide);

    if (slide) {
        window.addEventListener('keydown', close);
        window.addEventListener('keydown', deleteSlide);
    }
});

let projectTitle = '';

function setWindowTitle() {
    document.title = `${projectTitle || ''} - MapGallery Editor`;
}

EventBus.$on('filename', () => {
    setWindowTitle();
});

EventBus.$on(EventBus.events.PROJECT_TITLE_CHANGED, (value) => {
    projectTitle = value;
    setWindowTitle();
});

EventBus.$on(EventBus.events.POPUP_OPENED, () => {
    removeAll();
});

EventBus.$on(EventBus.events.POPUP_CLOSED, (value, num) => {
    if (num === 0) {
        addAll();
    }
});

addAll();

export default {};

'use strict';
import { silenceError, isHandled } from './inspect';

const UNHANDLED_REJECTION = 'unhandledRejection';
const HANDLED_REJECTION = 'rejectionHandled';

export default class ErrorHandler {
    constructor(emitEvent, reportError) {
        this.errors = [];
        this.emit = emitEvent;
        this.reportError = reportError;
    }

    track(e) {
        if (!this.emit(UNHANDLED_REJECTION, e, e.value)) {
            if (this.errors.length === 0) {
                setTimeout(reportErrors, 1, this.reportError, this.errors);
            }
            this.errors.push(e);
        }
    }

    untrack(e) {
        silenceError(e);
        this.emit(HANDLED_REJECTION, e);
    }
}

function reportErrors(report, errors) {
    try {
        reportAll(errors, report);
    } finally {
        errors.length = 0;
    }
}

function reportAll(errors, report) {
    for (let i = 0; i < errors.length; ++i) {
        let e = errors[i];
        if (!isHandled(e)) {
            report(e);
        }
    }
}

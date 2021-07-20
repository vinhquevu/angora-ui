export interface Task {
    name: string;
    config_source: string;
    command: string;
    log: string;
    messages: string[];
    parameters: string[];
    parent_success: boolean;
    parents: string[];
    replay: number;
    triggers: string[];
    status: string; // Database field
    time_stamp: string; // Database field
}

export interface TaskLogRecord {
    id: number;
    log: string;
    name: string;
    trigger: string;
    command: string;
    parameters: string;
    status: string;
    time_stamp: string;
}

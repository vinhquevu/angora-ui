export interface Task {
    name: string;
    config_source: string;
    command: string;
    log: string;
    messages: Array<string>;
    parameters: Array<string>;
    parent_success: boolean;
    parents: [];
    replay: number;
    status: string;
    triggers: Array<string>;
    time_stamp: string;
    last_run_time: string;
}

import { Queue } from "bullmq";
import { getRedis } from "./redis";

export const QUEUE_SEND_ISSUE = "send-issue";

let _queue: Queue | null = null;

export function getSendIssueQueue() {
  if (!_queue) {
    _queue = new Queue(QUEUE_SEND_ISSUE, {
      connection: getRedis(),
      defaultJobOptions: {
        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    });
  }
  return _queue;
}

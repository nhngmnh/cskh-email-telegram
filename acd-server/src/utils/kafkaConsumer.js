import kafka from "../config/kafkaConfig.js";
export const consumer = kafka.consumer({groupId:'acd-group'})
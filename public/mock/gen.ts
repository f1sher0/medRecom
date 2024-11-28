import { faker } from '@faker-js/faker';
import { User, Patient, PatientRecord, Recommendation, Evaluation, Model, Log } from '../../src/types/type';
import {log} from "echarts/types/src/util/log";
import * as fs from 'fs';  // 引入 Node.js fs 模块来处理文件操作

export const mockUsers = (count: number): User[] => {
    return Array.from({ length: count }, (_, index) => ({
        user_id: index + 1,
        username: faker.internet.username(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['doctor', 'admin']),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
    }));
};

export const mockPatients = (count: number, doctorIds: number[]): Patient[] => {
    return Array.from({ length: count }, (_, index) => ({
        patient_id: index + 1,
        name: faker.person.fullName(),
        gender: faker.helpers.arrayElement(['male', 'female']),
        birth_date: faker.date.birthdate({ min: 20, max: 80, mode: 'age' }).toISOString(),
        created_by: faker.helpers.arrayElement(doctorIds),
        created_at: faker.date.past(),
    }));
};

export const mockPatientRecords = (count: number, patientIds: number[]): PatientRecord[] => {
    return Array.from({ length: count }, (_, index) => ({
        record_id: index + 1,
        patient_id: faker.helpers.arrayElement(patientIds),
        visit_date: faker.date.recent(),
        diagnoses: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.string.numeric(4)),
        procedures: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.string.numeric(4)),
        medications: Array.from({ length: faker.number.int({ min: 1, max: 6 }) }, () => faker.string.alphanumeric(4)),
    }));
};

export const mockRecommendations = (count: number, recordIds: number[]): Recommendation[] => {
    return Array.from({ length: count }, (_, index) => ({
        recommendation_id: index + 1,
        record_id: faker.helpers.arrayElement(recordIds),
        recommended_meds: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.string.alphanumeric(4)),
        ddi_rate: faker.number.float({ min: 0, max: 1, precision: 0.01 }),
        created_at: faker.date.recent(),
    }));
};

export const mockEvaluations = (count: number, recommendationIds: number[], doctorIds: number[]): Evaluation[] => {
    return Array.from({ length: count }, (_, index) => ({
        evaluation_id: index + 1,
        recommendation_id: faker.helpers.arrayElement(recommendationIds),
        doctor_id: faker.helpers.arrayElement(doctorIds),
        effectiveness_score: faker.number.int({ min: 1, max: 10 }),
        safety_score: faker.number.int({ min: 1, max: 10 }),
        comments: faker.lorem.sentence(),
        created_at: faker.date.recent(),
    }));
};

const users = mockUsers(5); // 示例：生成 5 个用户
const patients = mockPatients(10, [1, 2, 3]); // 假设医生 ID 为 1, 2, 3
const patientRecords = mockPatientRecords(20, [1, 2, 3, 4, 5]);
const recommendations = mockRecommendations(15, [1, 2, 3, 4, 5]);
const evaluations = mockEvaluations(10, [1, 2, 3], [1, 2]);

// 将数据保存为 JSON 文件
const data = {
    users,
    patients,
    patientRecords,
    recommendations,
    evaluations
};

// 保存数据到文件
fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
console.log("数据已保存到 'data.json'");

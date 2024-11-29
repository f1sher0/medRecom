export interface Patient {
    patient_id: number; // 患者唯一标识
    name: string; // 患者姓名
    gender: 'male' | 'female'; // 性别
    birth_date: string; // 出生日期 (ISO 格式: YYYY-MM-DD)
    created_by: number; // 创建该记录的医生ID (外键)
    created_at: Date; // 创建时间
}

export interface User {
    user_id: number; // 用户唯一标识
    username: string; // 用户名
    password: string; // 加密后的密码
    role: 'doctor' | 'admin'; // 用户角色
    created_at: Date; // 创建时间
    updated_at: Date; // 最后更新时间
}

export interface PatientRecord {
    record_id: number; // 就诊记录唯一标识
    patient_id: number; // 患者ID (外键)
    visit_date: Date; // 就诊日期
    diagnoses: string[]; // 诊断信息 (ICD 编码数组)
    procedures: string[]; // 手术信息 (ICD 编码数组)
    medications?: string[]; // 药物信息 (ATC 编码数组，可选)
}

export interface Recommendation {
    recommendation_id: number; // 推荐记录唯一标识
    record_id: number; // 对应的患者就诊记录ID (外键)
    recommended_meds: string[]; // 推荐的药物组合 (ATC 编码数组)
    ddi_rate: number; // 推荐组合的 DDI 率
    created_at: Date; // 推荐时间
}

export interface Evaluation {
    evaluation_id: number; // 评价记录唯一标识
    recommendation_id: number; // 对应的推荐记录ID (外键)
    doctor_id: number; // 评价医生ID (外键)
    effectiveness_score: number; // 有效性评分 (1-10)
    safety_score: number; // 安全性评分 (1-10)
    comments?: string; // 文字反馈 (可选)
    created_at: Date; // 评价时间
}

export interface Model {
    model_id: number; // 模型唯一标识
    version: string; // 模型版本号
    train_data_path?: string; // 训练数据路径 (可选)
    parameters?: Record<string, any>; // 模型训练参数 (JSON 格式)
    metrics?: Record<string, any>; // 模型评估指标 (JSON 格式)
    created_at: Date; // 模型创建时间
}

export interface Log {
    log_id: number; // 日志唯一标识
    user_id: number; // 操作用户ID (外键)
    action: string; // 操作描述
    timestamp: Date; // 操作时间
}

export interface EvaluationToShow extends Evaluation{
    doctor_name: string;
    record_id: number;
}
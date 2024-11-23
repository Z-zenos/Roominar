export const messageValidate = {
  required: (filed: string) => `${filed}をご入力下さい。`,
  minLength: (filed?: string, number?: number) => `${filed}は${number}文字以内で入力してください。`,
  maxLength: (filed?: string, number?: number) => `${filed}は${number}文字以内で入力してください。`,
  min: (filed?: string, number?: number) => `${filed}は${number}文字以内で入力してください。`,
  max: (filed?: string, number?: number) => `${filed}は${number}文字以内で入力してください。`,
  formattedMail: 'メール形式が正しくありません。',
  formattedUrl: '正しいURLの形式で入力してください。',
  requiredField: (filed: string) => `${filed}を入力してください。`,
  halfWidth: (filed: string) => `${filed}は半角数字で入力してください。`,
};

export const textNoData = 'データなし';

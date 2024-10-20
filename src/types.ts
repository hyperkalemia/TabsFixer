import { z } from 'zod';

const zodLiteralRecord = <KeyType extends string, ZodValueType extends z.ZodType>(keys: KeyType[], zodValueType: ZodValueType) => {
	return z.object(keys.reduce((memo, k) => Object.assign(memo, { [k]: zodValueType }), {} as Record<KeyType, ZodValueType>));
};

export const zodValidate = <T extends z.ZodType>(zodSchema: T, value: unknown): value is z.infer<T> => {
	return zodSchema.safeParse(value).success;
};

export const configValidate = <T extends ConfigKeys>(key: T, value: unknown): value is Exclude<Config[T], undefined> => {
	return value !== undefined && ConfigSchema.shape[key].safeParse(value).success;
};

const TabClassesEnum = [
	'tab-all',
	'tab-web',
	'tab-picture',
	'tab-video',
	'tab-shopping',
	'tab-news',
	'tab-book',
	'tab-map',
	'tab-flight',
	'tab-finance',
	'separator',
] as const;
export const TabClassesSchema = z.enum(TabClassesEnum);
export type TabClasses = z.infer<typeof TabClassesSchema>;

export const TabClassesArraySchema = z.array(TabClassesSchema).length(TabClassesEnum.length);
export type TabClassesArray = z.infer<typeof TabClassesArraySchema>;
const defaultTabsOrder: TabClassesArray = [
	'tab-all',
	'tab-web',
	'tab-picture',
	'tab-video',
	'separator',
	'tab-shopping',
	'tab-news',
	'tab-book',
	'tab-map',
	'tab-flight',
	'tab-finance',
] as const;

const TabLabelsEnum = ['すべて', 'ウェブ', '画像', '動画', 'ショッピング', 'ニュース', '書籍', '地図', 'フライト', '金融'] as const;
export const TabLabelsSchema = z.enum(TabLabelsEnum);
export type TabLabels = z.infer<typeof TabLabelsSchema>;

export const TabDataSchema = zodLiteralRecord(
	[...TabClassesEnum.filter((item) => item !== 'separator')],
	z.object({
		label: TabLabelsSchema.optional(),
		val: z.string().nullable(),
	}),
);
export type TabData = z.infer<typeof TabDataSchema>;
export const tabsData: TabData = {
	'tab-all': {
		label: 'すべて',
		val: 'search',
	},
	'tab-web': {
		label: 'ウェブ',
		val: 'udm=14',
	},
	'tab-picture': {
		label: '画像',
		val: 'udm=2',
	},
	'tab-video': {
		label: '動画',
		val: 'tbm=vid',
	},
	'tab-shopping': {
		label: 'ショッピング',
		val: 'tbm=shop',
	},
	'tab-news': {
		label: 'ニュース',
		val: 'tbm=nws',
	},
	'tab-book': {
		label: '書籍',
		val: 'tbm=bks',
	},
	'tab-map': {
		label: '地図',
		val: 'maps',
	},
	'tab-flight': {
		label: 'フライト',
		val: 'travel/flights',
	},
	'tab-finance': {
		label: '金融',
		val: 'finance',
	},
};

export const ConfigSchema = z.object({
	TabsArray: TabClassesArraySchema.optional(),
});
export type Config = z.infer<typeof ConfigSchema>;
export type ConfigKeys = keyof Config;

export const defaultConfig: Config = {
	TabsArray: defaultTabsOrder,
};

export const RequestMessageSchema = z.object({
	target: z.enum(['background', 'contentScripts']),
	content: ConfigSchema,
});
export type RequestMessage = z.infer<typeof RequestMessageSchema>;

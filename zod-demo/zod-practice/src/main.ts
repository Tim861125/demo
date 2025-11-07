import { email, z } from "zod";

const output = z.string();

const s1 = "Hello World";
console.log(output.parse(s1));
console.log(output.safeParse(s1));
const s2 = 123;
// console.log(output.parse(s2));
console.log(output.safeParse(s2));

/**
 * type User = {
 *   username: string;
 *   age: number;
 * }
 */


// const UserSchema = z.object({
//   username: z.string(),
//   username: z.string().default("user"),
//   username: z.string().default("user-" + crypto.randomUUID()),
//   username: z.string({ invalid_type_error: "username 欄位應為字串型別" }),
//   username: z.string().max(2,{ error : "username 欄位的字串最大長度應為 2"}),
//   age: z.number().min(1,{ error : "age 欄位的最小值應為 1"}).optional(),
//   age: z.number(),
//   age: z.number().optional(),
//   email: z.string(),email().optional(),
//   hobby: z.enum(["Sleep", "Eat", "Drink"]),
// });

// .partial(); 可選的
// .pick({ username: true }); 選出來的
// .omit({ username: true }); 排除的

// const FoodSchema = z.object({
//   name: z.string(),
//   price: z.number(),
//   amount: z.number(),
// });

// .merge(FoodSchema);
// .passthrough(); 接收額外屬性
// .strict(); 不接收額外屬性

// type User = z.infer<typeof UserSchema>;

// const Wei: User = {
//   username: "Wei",
//   username: 123,
//   age: 25,
//   age: -1,
//   email: "tim861125@gmail.com"
//   hobby: "",
// };

// console.log(Wei);
import Category from "../../domain/entities/category";
import { CategoryOuputMapper } from "./category-output";

describe("CategoryOutputMapper Unit Test", () => {
  it("should convert a category to output", () => {
    const created_at = new Date();
    const baseEntity = {
      name: "movie",
      description: "desc",
      is_active: true,
      created_at,
    };
    const entity = new Category(baseEntity);
    const out = CategoryOuputMapper.toOutput(entity);
    expect(out).toStrictEqual({
      id: entity.id,
      ...baseEntity,
    });
  });
});

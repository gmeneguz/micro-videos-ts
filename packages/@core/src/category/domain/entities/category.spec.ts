import { Category } from "#category/domain/entities/category";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";

describe("Category Unit Tests", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });

  test("category constructor", () => {
    let category = new Category({ name: "movie" });
    let props = category.props;
    const created = props.created_at;
    delete props.created_at;
    expect(Category.validate).toHaveBeenCalled();
    expect(props).toStrictEqual({
      name: "movie",
      description: null,
      is_active: true,
    });
    expect(created).toBeInstanceOf(Date);

    const created_at = new Date();
    props = {
      name: "movie",
      description: "desc",
      is_active: false,
      created_at,
    };
    category = new Category(props);
    expect(category.props).toStrictEqual(props);

    props = {
      name: "movie2",
      description: "desc2",
    };
    category = new Category(props);
    expect(category.props).toMatchObject(props);

    /////
    props = {
      name: "movie3",
      is_active: true,
    };
    category = new Category(props);
    expect(category.props).toMatchObject(props);
  });

  test("update method", () => {
    const name = "movie_upated";
    const description = "desc_updated";
    let category = new Category({ name: "movie" });
    category.update({ name, description });
    expect(Category.validate).toHaveBeenCalledTimes(2);
    expect(category.name).toBe(name);
    expect(category.description).toBe(description);
  });
  test("activate and deactivate methods", () => {
    let category = new Category({ name: "movie" });
    category.activate();
    expect(category.is_active).toBeTruthy();

    category.deactivate();
    expect(category.is_active).toBeFalsy();

    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  test("getter of id field", () => {
    let category = new Category({ name: "movie" });
    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);

    category = new Category({ name: "movie" });
    expect(category.id).not.toBeNull();
    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);

    category = new Category({ name: "movie" }, null);
    expect(category.id).not.toBeNull();
    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);

    category = new Category({ name: "movie" }, undefined);
    expect(category.id).not.toBeNull();
    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);

    category = new Category({ name: "movie" });
    expect(category.id).not.toBeNull();
    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
  });

  test("getter of name field", () => {
    const category = new Category({ name: "movie" });
    expect(category.name).toBe("movie");
  });

  test("getter and setter of description field", () => {
    const category = new Category({ name: "movie" });
    expect(category.description).toBeNull();
    category.description = "desc";
    expect(category.description).toBe("desc");
    category.description = null;
    expect(category.description).toBeNull();
    category.description = undefined;
    expect(category.description).toBeNull();
  });

  test("getter and setter of is_active field", () => {
    let category = new Category({ name: "movie" });
    expect(category.is_active).toBeTruthy();

    category.is_active = false;
    expect(category.is_active).toBeFalsy();

    category.is_active = true;
    expect(category.is_active).toBeTruthy();

    category = new Category({ name: "movie", is_active: false });
    expect(category.is_active).toBeFalsy();
  });

  test("getter and setter of created_at field", () => {
    let category = new Category({ name: "movie" });
    expect(category.created_at).toBeInstanceOf(Date);

    let createdAt = new Date();
    category = new Category({ name: "movie", created_at: createdAt });
    expect(category.created_at).toBe(createdAt);
  });
});

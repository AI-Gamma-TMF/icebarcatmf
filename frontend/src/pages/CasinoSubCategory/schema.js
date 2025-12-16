import * as Yup from "yup";

export const createSubCategorySchema = (t) =>
  Yup.object().shape({
    subCategoryName: Yup.string()
      .max(100, t("casinoSubCategory.inputField.categoryName.errors.max"))
      .required(t("casinoSubCategory.inputField.categoryName.errors.required"))
      .nullable(),
    // masterGameCategoryId: Yup.string().required(
    //   t("casinoSubCategory.inputField.category.errors.required")
    // ),
    thumbnail: Yup.mixed()
      .required(t("casinoSubCategory.inputField.thumbnail.errors.required"))
      .test(
        "File Size",
        t("casinoSubCategory.inputField.thumbnail.errors.max"),
        (value) => !value || (value && value.size <= 1024 * 1024)
      )
      .test(
        "FILE_FORMAT",
        t("casinoSubCategory.inputField.thumbnail.errors.invalidFormat"),
        (value) =>
          !value ||
          (value && value.type === "image/svg+xml")
      ),
      selectedThumbnail: Yup.mixed()
      .required(t("casinoSubCategory.inputField.thumbnail.errors.required"))
      .test(
        "File Size",
        t("casinoSubCategory.inputField.thumbnail.errors.max"),
        (value) => !value || (value && value.size <= 1024 * 1024)
      )
      .test(
        "FILE_FORMAT",
        t("casinoSubCategory.inputField.thumbnail.errors.invalidFormat"),
        (value) =>
          !value ||
          (value && value.type === "image/svg+xml")
      ),
      
  });

export const editSubCategorySchema = (t) =>
  Yup.object().shape({
    subCategoryName: Yup.string()
      .max(100, t("casinoSubCategory.inputField.categoryName.errors.max"))
      .required(t("casinoSubCategory.inputField.categoryName.errors.required"))
      .nullable(),
    // masterGameCategoryId: Yup.string().required(
    //   t("casinoSubCategory.inputField.category.errors.required")
    // ),
    thumbnail: Yup.mixed()
      .required(t("casinoSubCategory.inputField.thumbnail.errors.required"))
      .test(
        "File Size",
        t("casinoSubCategory.inputField.thumbnail.errors.max"),
        (value) => !value || (value && value.size <= 1024 * 1024)
      )
      .test(
        "FILE_FORMAT",
        t("casinoSubCategory.inputField.thumbnail.errors.invalidFormat"),
        (value) =>
          !value ||
          (value && value.type === "image/svg+xml")
      )
      .nullable(),
      
      selectedThumbnail: Yup.mixed()
      .required(t("casinoSubCategory.inputField.thumbnail.errors.required"))
      .test(
        "File Size",
        t("casinoSubCategory.inputField.thumbnail.errors.max"),
        (value) => !value || (value && value.size <= 1024 * 1024)
      )
      .test(
        "FILE_FORMAT",
        t("casinoSubCategory.inputField.thumbnail.errors.invalidFormat"),
        (value) =>
          !value ||
          (value && value.type === "image/svg+xml")
      )
      .nullable(),
  });

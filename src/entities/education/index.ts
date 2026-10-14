export type Education = {
  school: string;
  field: string;
  /** Years only. */
  dates: string;
};

// Source of truth: EDUCATION in ../build_resume.py.
export const education: Education[] = [
  {
    school: "Inha University in Tashkent",
    field: "Computer and Information Engineering",
    dates: "2015 – 2019",
  },
];

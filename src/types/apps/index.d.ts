export interface IAppsData {
  solution: string;
  name: string;
  slug: string;
  id: string;
  structure: {
    label: string;
    slug: string;
    field_type: string;
    params: {
      required: boolean;
      hidden: boolean;
      max_length: number;
      placeholder: string;
      system_label: string;
      default_value: any;
      is_auto_generated: boolean;
    }
  }[];
}

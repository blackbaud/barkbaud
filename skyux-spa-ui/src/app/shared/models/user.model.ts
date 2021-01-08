export interface User {
  authenticated: boolean;
  environment_id?: string;
  environment_name?: string;
  legal_entity_id?: string;
  legal_entity_name?: string;
  user_id?: string;
  given_name?: string;
  family_name?: string;
}

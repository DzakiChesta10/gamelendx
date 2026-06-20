
DO $$
DECLARE
  v_admin uuid;
  v_user uuid;
BEGIN
  SELECT id INTO v_admin FROM auth.users WHERE email = 'admin@gamelendx.com';
  IF v_admin IS NULL THEN
    v_admin := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_admin, 'authenticated', 'authenticated',
      'admin@gamelendx.com', crypt('admin123', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      '{"username":"admin","display_name":"Administrator"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_admin, v_admin::text, format('{"sub":"%s","email":"%s"}', v_admin, 'admin@gamelendx.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (v_admin, 'admin', 'Administrator')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_admin, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  SELECT id INTO v_user FROM auth.users WHERE email = 'user@gamelendx.com';
  IF v_user IS NULL THEN
    v_user := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user, 'authenticated', 'authenticated',
      'user@gamelendx.com', crypt('user1234', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      '{"username":"demo_user","display_name":"Demo User"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user, v_user::text, format('{"sub":"%s","email":"%s"}', v_user, 'user@gamelendx.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (v_user, 'demo_user', 'Demo User')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;

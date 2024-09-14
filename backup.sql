--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: enum_Events_dyscyplina; Type: TYPE; Schema: public; Owner: uzytkownik
--

CREATE TYPE public."enum_Events_dyscyplina" AS ENUM (
    'FOOTBALL',
    'BASKETBALL',
    'TENNIS'
);


ALTER TYPE public."enum_Events_dyscyplina" OWNER TO uzytkownik;

--
-- Name: enum_Events_grupa_wiekowa; Type: TYPE; Schema: public; Owner: uzytkownik
--

CREATE TYPE public."enum_Events_grupa_wiekowa" AS ENUM (
    'YOUNG',
    'ADULT'
);


ALTER TYPE public."enum_Events_grupa_wiekowa" OWNER TO uzytkownik;

--
-- Name: enum_Places_dyscyplina; Type: TYPE; Schema: public; Owner: uzytkownik
--

CREATE TYPE public."enum_Places_dyscyplina" AS ENUM (
    'FOOTBALL',
    'BASKETBALL',
    'TENNIS'
);


ALTER TYPE public."enum_Places_dyscyplina" OWNER TO uzytkownik;

--
-- Name: enum_Users_grupa_wiekowa; Type: TYPE; Schema: public; Owner: uzytkownik
--

CREATE TYPE public."enum_Users_grupa_wiekowa" AS ENUM (
    'YOUNG',
    'ADULT'
);


ALTER TYPE public."enum_Users_grupa_wiekowa" OWNER TO uzytkownik;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: EventParticipants; Type: TABLE; Schema: public; Owner: kuba
--

CREATE TABLE public."EventParticipants" (
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public."EventParticipants" OWNER TO kuba;

--
-- Name: Events; Type: TABLE; Schema: public; Owner: kuba
--

CREATE TABLE public."Events" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    id_autora uuid,
    id_miejsca uuid,
    max_liczba_uczestnikow integer NOT NULL,
    data_rozpoczecia timestamp without time zone NOT NULL,
    czas_trwania integer NOT NULL,
    grupa_wiekowa character varying(10) NOT NULL,
    dyscyplina character varying(50) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    CONSTRAINT "Events_dyscyplina_check" CHECK (((dyscyplina)::text = ANY ((ARRAY['FOOTBALL'::character varying, 'BASKETBALL'::character varying, 'TENNIS'::character varying])::text[]))),
    CONSTRAINT "Events_grupa_wiekowa_check" CHECK (((grupa_wiekowa)::text = ANY ((ARRAY['YOUNG'::character varying, 'ADULT'::character varying])::text[])))
);


ALTER TABLE public."Events" OWNER TO kuba;

--
-- Name: Places; Type: TABLE; Schema: public; Owner: kuba
--

CREATE TABLE public."Places" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    dyscyplina character varying(50) NOT NULL,
    nazwa character varying(255) NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    adres character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    CONSTRAINT "Places_dyscyplina_check" CHECK (((dyscyplina)::text = ANY ((ARRAY['FOOTBALL'::character varying, 'BASKETBALL'::character varying, 'TENNIS'::character varying])::text[])))
);


ALTER TABLE public."Places" OWNER TO kuba;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: kuba
--

CREATE TABLE public."Users" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    haslo character varying(255) NOT NULL,
    grupa_wiekowa character varying(10) NOT NULL,
    CONSTRAINT "Users_grupa_wiekowa_check" CHECK (((grupa_wiekowa)::text = ANY ((ARRAY['YOUNG'::character varying, 'ADULT'::character varying])::text[])))
);


ALTER TABLE public."Users" OWNER TO kuba;

--
-- Data for Name: EventParticipants; Type: TABLE DATA; Schema: public; Owner: kuba
--

COPY public."EventParticipants" (event_id, user_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Events; Type: TABLE DATA; Schema: public; Owner: kuba
--

COPY public."Events" (id, id_autora, id_miejsca, max_liczba_uczestnikow, data_rozpoczecia, czas_trwania, grupa_wiekowa, dyscyplina, "createdAt", "updatedAt") FROM stdin;
cfe93251-a0fc-44d9-b0ad-632895188768	6beba79c-3421-4af0-a012-d3d5b221a98e	06e8da63-a434-47ce-a2fa-87274ee4faed	10	2024-09-12 10:00:00	60	YOUNG	FOOTBALL	2024-09-14 12:47:46.200339+02	2024-09-14 12:47:52.258901+02
\.


--
-- Data for Name: Places; Type: TABLE DATA; Schema: public; Owner: kuba
--

COPY public."Places" (id, dyscyplina, nazwa, lat, lng, adres, "createdAt", "updatedAt") FROM stdin;
06e8da63-a434-47ce-a2fa-87274ee4faed	FOOTBALL	Central Park Soccer Field	40.785091	-73.968285	New York, NY, USA	2024-09-14 13:24:55.638717+02	2024-09-14 13:25:08.030132+02
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: kuba
--

COPY public."Users" (id, email, haslo, grupa_wiekowa) FROM stdin;
6beba79c-3421-4af0-a012-d3d5b221a98e	test@example.com	$2a$10$bhsCPIJzoYD7PAQmzIDBcubmzQbXvEDwr36D6pZFDZhRcrF3bcarq	YOUNG
ee6185cb-2ec1-4a2a-809d-f629bbe407ca	chuj@dupa.com	$2a$10$7l2wxnRaB4GJiNZNWJrB9Ocd4rpeQbAxYnWzVciPbTyP7Uac1g8J.	YOUNG
\.


--
-- Name: EventParticipants EventParticipants_pkey; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."EventParticipants"
    ADD CONSTRAINT "EventParticipants_pkey" PRIMARY KEY (event_id, user_id);


--
-- Name: Events Events_pkey; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_pkey" PRIMARY KEY (id);


--
-- Name: Places Places_pkey; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Places"
    ADD CONSTRAINT "Places_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: EventParticipants EventParticipants_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."EventParticipants"
    ADD CONSTRAINT "EventParticipants_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public."Events"(id) ON DELETE CASCADE;


--
-- Name: EventParticipants EventParticipants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."EventParticipants"
    ADD CONSTRAINT "EventParticipants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: Events Events_id_autora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_id_autora_fkey" FOREIGN KEY (id_autora) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: Events Events_id_miejsca_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_id_miejsca_fkey" FOREIGN KEY (id_miejsca) REFERENCES public."Places"(id) ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: kuba
--

GRANT USAGE ON SCHEMA public TO uzytkownik;


--
-- Name: TABLE "EventParticipants"; Type: ACL; Schema: public; Owner: kuba
--

GRANT ALL ON TABLE public."EventParticipants" TO uzytkownik;


--
-- Name: TABLE "Events"; Type: ACL; Schema: public; Owner: kuba
--

GRANT ALL ON TABLE public."Events" TO uzytkownik;


--
-- Name: TABLE "Places"; Type: ACL; Schema: public; Owner: kuba
--

GRANT ALL ON TABLE public."Places" TO uzytkownik;


--
-- Name: TABLE "Users"; Type: ACL; Schema: public; Owner: kuba
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."Users" TO uzytkownik;


--
-- PostgreSQL database dump complete
--


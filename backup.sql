--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-16 17:03:29 CEST

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
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: kuba
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO kuba;

--
-- TOC entry 2 (class 3079 OID 16467)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 857 (class 1247 OID 16460)
-- Name: enum_Events_dyscyplina; Type: TYPE; Schema: public; Owner: uzytkownik
--

CREATE TYPE public."enum_Events_dyscyplina" AS ENUM (
    'FOOTBALL',
    'BASKETBALL',
    'TENNIS'
);


ALTER TYPE public."enum_Events_dyscyplina" OWNER TO uzytkownik;

--
-- TOC entry 854 (class 1247 OID 16454)
-- Name: enum_Events_grupa_wiekowa; Type: TYPE; Schema: public; Owner: uzytkownik
--

CREATE TYPE public."enum_Events_grupa_wiekowa" AS ENUM (
    'YOUNG',
    'ADULT'
);


ALTER TYPE public."enum_Events_grupa_wiekowa" OWNER TO uzytkownik;

--
-- TOC entry 851 (class 1247 OID 16446)
-- Name: enum_Places_dyscyplina; Type: TYPE; Schema: public; Owner: uzytkownik
--

CREATE TYPE public."enum_Places_dyscyplina" AS ENUM (
    'FOOTBALL',
    'BASKETBALL',
    'TENNIS'
);


ALTER TYPE public."enum_Places_dyscyplina" OWNER TO uzytkownik;

--
-- TOC entry 848 (class 1247 OID 16440)
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
-- TOC entry 213 (class 1259 OID 16424)
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
-- TOC entry 212 (class 1259 OID 16406)
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
-- TOC entry 211 (class 1259 OID 16397)
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
-- TOC entry 210 (class 1259 OID 16386)
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
-- TOC entry 3701 (class 0 OID 16424)
-- Dependencies: 213
-- Data for Name: EventParticipants; Type: TABLE DATA; Schema: public; Owner: kuba
--

COPY public."EventParticipants" (event_id, user_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3700 (class 0 OID 16406)
-- Dependencies: 212
-- Data for Name: Events; Type: TABLE DATA; Schema: public; Owner: kuba
--

COPY public."Events" (id, id_autora, id_miejsca, max_liczba_uczestnikow, data_rozpoczecia, czas_trwania, grupa_wiekowa, dyscyplina, "createdAt", "updatedAt") FROM stdin;
cfe93251-a0fc-44d9-b0ad-632895188768	6beba79c-3421-4af0-a012-d3d5b221a98e	06e8da63-a434-47ce-a2fa-87274ee4faed	10	2024-09-12 10:00:00	60	YOUNG	FOOTBALL	2024-09-14 12:47:46.200339+02	2024-09-14 12:47:52.258901+02
\.


--
-- TOC entry 3699 (class 0 OID 16397)
-- Dependencies: 211
-- Data for Name: Places; Type: TABLE DATA; Schema: public; Owner: kuba
--

COPY public."Places" (id, dyscyplina, nazwa, lat, lng, adres, "createdAt", "updatedAt") FROM stdin;
06e8da63-a434-47ce-a2fa-87274ee4faed	FOOTBALL	Central Park Soccer Field	40.785091	-73.968285	New York, NY, USA	2024-09-14 13:24:55.638717+02	2024-09-14 13:25:08.030132+02
\.


--
-- TOC entry 3698 (class 0 OID 16386)
-- Dependencies: 210
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: kuba
--

COPY public."Users" (id, email, haslo, grupa_wiekowa) FROM stdin;
6beba79c-3421-4af0-a012-d3d5b221a98e	test@example.com	$2a$10$bhsCPIJzoYD7PAQmzIDBcubmzQbXvEDwr36D6pZFDZhRcrF3bcarq	YOUNG
ee6185cb-2ec1-4a2a-809d-f629bbe407ca	chuj@dupa.com	$2a$10$7l2wxnRaB4GJiNZNWJrB9Ocd4rpeQbAxYnWzVciPbTyP7Uac1g8J.	YOUNG
\.


--
-- TOC entry 3554 (class 2606 OID 16428)
-- Name: EventParticipants EventParticipants_pkey; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."EventParticipants"
    ADD CONSTRAINT "EventParticipants_pkey" PRIMARY KEY (event_id, user_id);


--
-- TOC entry 3552 (class 2606 OID 16413)
-- Name: Events Events_pkey; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_pkey" PRIMARY KEY (id);


--
-- TOC entry 3550 (class 2606 OID 16405)
-- Name: Places Places_pkey; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Places"
    ADD CONSTRAINT "Places_pkey" PRIMARY KEY (id);


--
-- TOC entry 3546 (class 2606 OID 16396)
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- TOC entry 3548 (class 2606 OID 16394)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 3557 (class 2606 OID 16429)
-- Name: EventParticipants EventParticipants_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."EventParticipants"
    ADD CONSTRAINT "EventParticipants_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public."Events"(id) ON DELETE CASCADE;


--
-- TOC entry 3558 (class 2606 OID 16434)
-- Name: EventParticipants EventParticipants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."EventParticipants"
    ADD CONSTRAINT "EventParticipants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- TOC entry 3555 (class 2606 OID 16414)
-- Name: Events Events_id_autora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_id_autora_fkey" FOREIGN KEY (id_autora) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- TOC entry 3556 (class 2606 OID 16419)
-- Name: Events Events_id_miejsca_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kuba
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_id_miejsca_fkey" FOREIGN KEY (id_miejsca) REFERENCES public."Places"(id) ON DELETE SET NULL;


--
-- TOC entry 3707 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: kuba
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT USAGE ON SCHEMA public TO uzytkownik;


--
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE "EventParticipants"; Type: ACL; Schema: public; Owner: kuba
--

GRANT ALL ON TABLE public."EventParticipants" TO uzytkownik;


--
-- TOC entry 3710 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE "Events"; Type: ACL; Schema: public; Owner: kuba
--

GRANT ALL ON TABLE public."Events" TO uzytkownik;


--
-- TOC entry 3711 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE "Places"; Type: ACL; Schema: public; Owner: kuba
--

GRANT ALL ON TABLE public."Places" TO uzytkownik;


--
-- TOC entry 3712 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE "Users"; Type: ACL; Schema: public; Owner: kuba
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."Users" TO uzytkownik;


-- Completed on 2024-09-16 17:03:29 CEST

--
-- PostgreSQL database dump complete
--


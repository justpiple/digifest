"use client";

import Link, { Button } from "@/app/_components/global/button";
import { H1, H2, H3, P, SectionTitle } from "@/app/_components/global/text";
import cn from "@/lib/cn";
import { announcementWithStage, stageWithTeam } from "@/types/relation";
import {
  formatDateDMY,
  parseLinks,
  urlefy,
  verbalizeDate,
} from "@/utils/utils";
import { registered_team, stage, team_member } from "@prisma/client";
import Image from "next/image";
import { useContext } from "react";
import { FaBook, FaLocationDot } from "react-icons/fa6";
import { CompetitionCategoryDetail } from "./contexts";

function AnnouncementCard({
  announcement,
}: {
  announcement: announcementWithStage;
}) {
  return (
    <figure className="w-full rounded-[14px] border border-neutral-100 p-5">
      <P className="mb-1 text-black">{verbalizeDate(announcement.createdAt)}</P>
      <div className="flex w-full flex-col items-start justify-between lg:flex-row lg:items-center">
        <H3 className="mb-2 max-w-[380px] lg:mb-0">{announcement.title}</H3>
        <P
          dangerouslySetInnerHTML={{ __html: parseLinks(announcement.content) }}
        />
      </div>
    </figure>
  );
}

function GreetingBoard({
  announcements,
  team: currentTeam,
  activeStage,
}: {
  announcements: announcementWithStage[];
  team: registered_team;
  activeStage?: stageWithTeam;
}) {
  const context = useContext(CompetitionCategoryDetail);
  const { category, competition } = context!;

  return (
    <section className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
      {activeStage &&
      activeStage.teams.find((team) => team.id === currentTeam.id) ? (
        <SectionTitle>{activeStage.name}</SectionTitle>
      ) : (
        <div className="flex w-full justify-center rounded-full border border-primary-400 bg-primary-50 p-4 text-primary-400">
          Anda gagal melaju ke tahap {activeStage?.name}
        </div>
      )}
      <div
        className={cn(
          "mb-[54px] flex w-full items-center gap-5 lg:gap-10",
          activeStage ? "mt-6" : "",
        )}
      >
        <Image
          src={competition.logo}
          alt={competition.name}
          width={52}
          height={52}
          className="h-14 w-14 grayscale"
          unoptimized
        />
        <H1>Bidang {category.name}</H1>
      </div>
      <div className="mb-10 w-full">
        <div className="block">
          <h4
            className={cn(
              "inline-flex rounded-full border border-neutral-100 px-[14px] py-[6px] uppercase",
            )}
          >
            {
              {
                ACCEPTED: "Pembayaran diterima",
                REJECTED: "Pembayaran ditolak",
                PENDING: "Menunggu konfirmasi pembayaran",
              }[currentTeam.status]
            }
          </h4>
          <H1 className="mb-2 mt-3">
            Selamat Berkompetisi,{" "}
            <span className="text-primary-400">Tim {currentTeam.teamName}</span>
          </H1>
          <P className="mb-5">{category.description}</P>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <Link
              href={competition.guidebookUrl}
              variant={"primary"}
              className="w-full justify-center md:w-fit"
            >
              <FaBook />
              Lihat guidebook {competition.name}
            </Link>
            <Link
              href="#team"
              variant={"primary"}
              className="w-full justify-center md:w-fit"
            >
              Lihat data {currentTeam.teamName}
            </Link>
          </div>
        </div>
      </div>
      {activeStage && (
        <div className="p-4">
          <H2 className="mb-6">Pengumuman di {activeStage.name}</H2>
          <div className="flex flex-col gap-4">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function SubTimeline({
  startDate,
  endDate,
  title,
  description,
  location,
}: {
  startDate: Date;
  endDate: Date;
  title: string;
  description: string;
  location: string;
}) {
  return (
    <figure className="flex w-full flex-col rounded-[14px] border border-neutral-100 p-4">
      <P className="mb-3 text-black">
        <time dateTime={formatDateDMY(startDate)}>
          {verbalizeDate(startDate)}
        </time>{" "}
        -{" "}
        <time dateTime={formatDateDMY(endDate)}>{verbalizeDate(endDate)}</time>
      </P>
      <H3 className="mb-[10px]">{title}</H3>
      <P className="mb-6">{description}</P>
      <P className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-base text-primary-400">
        <FaLocationDot /> {location}
      </P>
    </figure>
  );
}

function Timeline({
  categoryName,
  stages,
}: {
  categoryName: string;
  stages: stage[];
}) {
  return (
    <section className="w-full py-[82px]" id="timeline">
      <div className="mb-[42px] block">
        <div className="w-full">
          <SectionTitle>TIMELINE</SectionTitle>
          <H1 className="mb-[18px] mt-[22px]">
            Timeline perlombaan {categoryName}
          </H1>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div className="grid w-full grid-cols-1 gap-[18px] gap-y-[52px] md:grid-cols-2 lg:grid-cols-3">
          {stages
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
            .map((stage, i) => (
              <SubTimeline
                key={stage.id}
                startDate={stage.startDate}
                endDate={stage.endDate}
                title={stage.name}
                description={stage.description}
                location={
                  i === stages.length - 1 ? "SMK Telkom Malang" : "Online"
                }
              />
            ))}
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({ member }: { member: team_member }) {
  const context = useContext(CompetitionCategoryDetail);
  const { competition, category } = context!;

  return (
    <button
      onClick={() => {
        window.location.href = `/dashboard/${urlefy(competition.name)}/${urlefy(category.name)}/register-member?id=${member.id}`;
      }}
      className="flex flex-col rounded-[14px] border border-neutral-100 p-4"
    >
      <Image
        src={member.photo}
        width={420}
        height={315}
        alt={member.name}
        className="w-full max-w-[420px] rounded-lg"
        unoptimized
      />
    </button>
  );
}

function TeamMembers({ teamMembers }: { teamMembers: team_member[] }) {
  const context = useContext(CompetitionCategoryDetail);
  const { category, competition } = context!;

  return (
    <section id="team" className="w-full">
      <div className="mb-[54px] flex w-full flex-col justify-between gap-4 md:flex-row md:items-center md:gap-0">
        <H1>Data Tim</H1>
        <Button
          onClick={() => {
            window.location.href = `/dashboard/${urlefy(competition.name)}/${urlefy(category.name)}/register-member`;
          }}
          variant={"primary"}
          className="w-fit"
        >
          Tambah Anggota
        </Button>
      </div>
      {teamMembers.length === 0 && (
        <P className="w-full text-center">Belum ada data anggota...</P>
      )}
      <div className={cn(`grid w-full grid-cols-3`)}>
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}

export { GreetingBoard, TeamMembers, Timeline };

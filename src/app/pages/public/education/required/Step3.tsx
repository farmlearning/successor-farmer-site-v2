import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import IdentityGate from '../../../../components/auth/IdentityGate';
import { CONSENT_FORM_TEXT } from '../../../../../data/legalText';

export default function EducationStep3() {
  return (
    <IdentityGate mode="apply">
      {(verifiedData) => <Step3Form verifiedData={verifiedData} />}
    </IdentityGate>
  );
}

function Step3Form({ verifiedData }: { verifiedData: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: verifiedData.name,
      birthdate: verifiedData.birthdate,
      phone: verifiedData.phone,
      gender: verifiedData.gender
    }
  });
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    alert('신청이 완료되었습니다. (데모)');
    console.log(data);
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">청년농업인 필수교육</h2>
        <p className="text-xl font-bold text-gray-600 mb-8">신청서 작성</p>

        <div className="flex justify-center items-center gap-4 text-sm font-medium text-gray-400">
          <span>Step 1. 권역선택</span>
          <ChevronRight size={16} />
          <span>Step 2. 과정선택</span>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-bold">Step 3. 신청서 작성</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-6 border-b border-gray-200 pb-2">기본 정보</h3>

        <div className="space-y-6">
          {/* Name */}
          <div className="grid md:grid-cols-4 items-center gap-4">
            <label className="font-bold text-gray-700">이름 <span className="text-red-500">*</span></label>
            <div className="md:col-span-3">
              <input
                {...register('name', { required: true })}
                type="text"
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none cursor-not-allowed"
              />
              {errors.name && <span className="text-red-500 text-sm">이름을 입력해주세요</span>}
            </div>
          </div>

          {/* Birthdate */}
          <div className="grid md:grid-cols-4 items-center gap-4">
            <label className="font-bold text-gray-700">생년월일 <span className="text-red-500">*</span></label>
            <div className="md:col-span-3">
              <input
                {...register('birthdate', { required: true })}
                type="date"
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid md:grid-cols-4 items-start gap-4">
            <label className="font-bold text-gray-700 mt-2">주소 <span className="text-red-500">*</span></label>
            <div className="md:col-span-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="우편번호"
                  readOnly
                  className="w-32 border border-gray-300 rounded px-3 py-2 bg-gray-50"
                />
                <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                  주소검색
                </button>
              </div>
              <input
                {...register('address', { required: true })}
                type="text"
                placeholder="기본주소"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              <input
                {...register('addressDetail')}
                type="text"
                placeholder="상세주소"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="grid md:grid-cols-4 items-center gap-4">
            <label className="font-bold text-gray-700">성별 <span className="text-red-500">*</span></label>
            <div className="md:col-span-3 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('gender', { required: true })} type="radio" value="male" disabled className="accent-blue-500" />
                남
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('gender', { required: true })} type="radio" value="female" disabled className="accent-blue-500" />
                여
              </label>
            </div>
          </div>

          {/* Education Type */}
          <div className="grid md:grid-cols-4 items-center gap-4">
            <label className="font-bold text-gray-700">교육생 구분 <span className="text-red-500">*</span></label>
            <div className="md:col-span-3 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('eduType', { required: true })} type="radio" value="crop" className="accent-blue-500" />
                선작농
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('eduType', { required: true })} type="radio" value="livestock" className="accent-blue-500" />
                축산농
              </label>
            </div>
          </div>

          {/* Main Crop */}
          <div className="grid md:grid-cols-4 items-center gap-4">
            <label className="font-bold text-gray-700">주작물 <span className="text-red-500">*</span></label>
            <div className="md:col-span-3">
              <select
                {...register('crop', { required: true })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">선택해주세요</option>
                <option value="rice">수도작</option>
                <option value="fruit">과수</option>
                <option value="vege">채소</option>
                <option value="special">특용작물</option>
                <option value="livestock">축산</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className="grid md:grid-cols-4 items-center gap-4">
            <label className="font-bold text-gray-700">휴대폰번호 <span className="text-red-500">*</span></label>
            <div className="md:col-span-3">
              <input
                {...register('phone', { required: true })}
                type="text"
                readOnly
                placeholder="000-0000-0000"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold mb-4">개인정보 수집·이용·제공 동의</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 h-48 overflow-y-auto text-sm text-gray-600 mb-4 whitespace-pre-wrap leading-relaxed">
            {CONSENT_FORM_TEXT}
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              {...register('agreement', { required: true })}
              type="checkbox"
              className="w-5 h-5 accent-blue-500"
            />
            <span className="font-bold">위와 같이 개인정보를 수집 · 이용 · 제3자 제공하는 것에 동의합니다. <span className="text-red-500 font-bold">(필수)</span></span>
          </label>
          {errors.agreement && <p className="text-red-500 text-sm mt-1">동의가 필요합니다.</p>}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
          >
            제출하기
          </button>
        </div>

      </form>
    </div>
  );
}

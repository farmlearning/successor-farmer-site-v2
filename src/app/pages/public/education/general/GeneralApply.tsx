import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, Phone, Mail, Check } from 'lucide-react';
import { supabase } from '../../../../../utils/supabase';
import { CONSENT_FORM_TEXT } from '../../../../../data/legalText';
import PostcodeModal from '../../../../components/common/PostcodeModal';

export default function GeneralApply() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl font-sans">
      {/* Header Section - Always Visible */}
      <div className="flex flex-col items-center justify-center mb-12">
        <span className="text-[#02522e] text-2xl font-medium tracking-[0.5rem] mb-4">
          FARM LEARNING
        </span>
        <h1 className="text-center font-bold text-[#56a982] text-5xl md:text-6xl mb-6">
          후계농업경영인 필수교육
        </h1>
        <span className="block px-6 py-2 rounded-full bg-[#0ea5e9] text-white text-xl font-bold min-w-[280px] text-center opacity-0 h-0">
          {/* Spacer/Placeholder for pill if needed */}
        </span>
      </div>

      <GeneralApplyForm />
    </div>
  );
}

function GeneralApplyForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      user_name: '',
      birth: '',
      user_hp: '',
      gender: '',
      foreigner_yn: 'N',
      email: '',
      addr1: '',
      addr2: '',
      zip_code: '',
      agree_check: false
    }
  });
  const navigate = useNavigate();
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // Address Search Logic
  const handleAddressComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    // Set values (ensure to check your form key mapping, seems like addr1 is full address)
    // Also likely need to set zip_code
    // Using setValue from useForm (need to destructure setValue)
    setValue('zip_code', data.zonecode, { shouldValidate: true });
    setValue('addr1', fullAddress, { shouldValidate: true });
    // Focus on detail address
    const addr2Input = document.querySelector('input[name="addr2"]') as HTMLInputElement;
    if (addr2Input) addr2Input.focus();
  };

  // Validation Error Handler
  const onInvalid = (errors: any) => {
    let message = '다음 필수 항목을 입력해주세요:\n';
    if (errors.user_name) message += '- 이름\n';
    if (errors.birth) message += '- 생년월일\n';
    if (errors.user_hp) message += '- 휴대폰번호\n';
    if (errors.gender) message += '- 성별\n';
    if (errors.addr1 || errors.zip_code) message += '- 주소\n';
    if (errors.agree_check) message += '- 개인정보 수집 동의\n';

    alert(message);
  };

  const handleUserRegistration = async (data: any) => {
    try {
      // 1. Check if user exists
      const { data: existingUsers, error: searchError } = await supabase
        .from('students')
        .select('*')
        .eq('name', data.user_name)
        .eq('phone', data.user_hp)
        .eq('birth_date', data.birth);

      if (searchError) throw searchError;

      let userId;

      if (existingUsers && existingUsers.length > 0) {
        // User exists - Login/Link logic
        userId = existingUsers[0].id;
        console.log('User found:', userId);
        // Here we would typically set the user session or context
      } else {
        // User does not exist - Create new user
        const { data: newUser, error: createError } = await supabase
          .from('students')
          .insert([
            {
              name: data.user_name,
              phone: data.user_hp,
              birth_date: data.birth,
              gender: data.gender === 'M' ? 'male' : 'female',
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        userId = newUser.id;
      }

      // 2. Create Application Record
      // Check if already applied
      const { data: existingApp, error: appCheckError } = await supabase
        .from('applications')
        .select('id')
        .eq('student_id', userId)
        .eq('category', 'general')
        .eq('status', 'REGISTERED')
        .maybeSingle();

      if (appCheckError) throw appCheckError;

      if (existingApp) {
        alert('이미 신청된 내역이 있습니다.');
      } else {
        const { error: appError } = await supabase
          .from('applications')
          .insert([
            {
              student_id: userId,
              category: 'general',
              status: 'REGISTERED',
              payment_status: 'PENDING',
              created_at: new Date().toISOString()
            }
          ]);

        if (appError) {
          // If table doesn't exist, this will error. 
          // Ideally we'd have a specific error for 'relation does not exist'.
          throw appError;
        }
      }

      // 3. Proceed
      alert('신청이 완료되었습니다.\n(회원확인/등록 및 접수 완료)');
      navigate('/');

    } catch (error: any) {
      console.error('Error in registration/application:', error);
      alert('신청 처리 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const onSubmit = (data: any) => {
    handleUserRegistration(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
      <PostcodeModal
        isOpen={isPostcodeOpen}
        onClose={() => setIsPostcodeOpen(false)}
        onComplete={handleAddressComplete}
      />

      {/* Basic Info Panel */}
      <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm bg-white">
        <div className="bg-gray-100 px-5 py-3 border-b border-gray-300">
          <strong className="text-gray-800 text-lg">기본 정보</strong>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name (user_name) */}
            <div className="form-group">
              <label className="block text-gray-700 font-bold mb-2">이름 <span className="text-red-500 text-xs ml-2 font-bold">필수</span></label>
              <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 h-10">
                <input
                  {...register('user_name', { required: true })}
                  type="text"
                  placeholder=""
                  className="w-full px-3 py-2 bg-white outline-none text-gray-700"
                />
                <div className="bg-gray-100 border-l border-gray-300 w-10 h-full flex items-center justify-center text-gray-500">
                  <User size={18} />
                </div>
              </div>
            </div>

            {/* Birth (birth) */}
            <div className="form-group">
              <label className="block text-gray-700 font-bold mb-2">생년월일 <span className="text-red-500 text-xs ml-2 font-bold">필수</span></label>
              <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 h-10">
                <input
                  {...register('birth', { required: true })}
                  type="text"
                  placeholder="YYYY-MM-DD"
                  className="w-full px-3 py-2 bg-white outline-none text-gray-700"
                />
                <div className="bg-gray-100 border-l border-gray-300 w-10 h-full flex items-center justify-center text-gray-500">
                  <Calendar size={18} />
                </div>
              </div>
            </div>

            {/* Address Search (zip_code + addr1) */}
            <div className="form-group">
              <label className="block text-gray-700 font-bold mb-2">주소검색 <span className="text-red-500 text-xs ml-2 font-bold">필수</span></label>
              <div className="flex gap-0 h-10">
                <input
                  {...register('zip_code')}
                  type="text"
                  readOnly
                  placeholder=""
                  className="w-20 border border-gray-300 border-r-0 rounded-l-sm px-2 py-2 bg-gray-50 outline-none text-center text-sm"
                />
                <input
                  {...register('addr1', { required: true })}
                  type="text"
                  readOnly
                  className="flex-1 border border-gray-300 border-r-0 px-3 py-2 bg-gray-50 outline-none"
                  onClick={() => setIsPostcodeOpen(true)}
                />
                <button
                  type="button"
                  onClick={() => setIsPostcodeOpen(true)}
                  className="bg-[#4458cb] text-white px-4 text-sm font-medium hover:bg-[#3b48b8] transition-colors rounded-r-sm min-w-[80px]"
                >
                  주소검색
                </button>
              </div>
            </div>

            {/* Address Detail (addr2) */}
            <div className="form-group">
              <label className="block text-gray-700 font-bold mb-2">상세주소</label>
              <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 h-10">
                <input
                  {...register('addr2')}
                  type="text"
                  className="w-full px-3 py-2 outline-none text-gray-700"
                />
                <div className="bg-gray-100 border-l border-gray-300 w-10 h-full flex items-center justify-center text-gray-500">
                  <MapPin size={18} />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="form-group">
              <label className="block text-gray-700 font-bold mb-2">성별 <span className="text-red-500 text-xs ml-2 font-bold">필수</span></label>
              <div className="flex items-center gap-6 pl-1 h-10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('gender', { required: true })} type="radio" value="M" className="w-4 h-4 accent-blue-600" />
                  <span>남</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('gender', { required: true })} type="radio" value="F" className="w-4 h-4 accent-blue-600" />
                  <span>여</span>
                </label>
              </div>
            </div>

            {/* Phone (user_hp) */}
            <div className="form-group">
              <label className="block text-gray-700 font-bold mb-2">휴대폰번호 <span className="text-red-500 text-xs ml-2 font-bold">필수</span></label>
              <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 h-10">
                <input
                  {...register('user_hp', { required: true })}
                  type="text"
                  placeholder=""
                  className="w-full px-3 py-2 bg-white outline-none text-gray-700"
                />
                <div className="bg-gray-100 border-l border-gray-300 w-10 h-full flex items-center justify-center text-gray-500">
                  <Phone size={18} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="block text-gray-700 font-bold mb-2">이메일</label>
              <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 h-10">
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 outline-none text-gray-700"
                />
                <div className="bg-gray-100 border-l border-gray-300 w-10 h-full flex items-center justify-center text-gray-500">
                  <Mail size={18} />
                </div>
              </div>
            </div>

            {/* Foreigner (foreigner_yn) */}
            <div className="form-group">
              <label className="block text-gray-700 font-bold mb-2">외국인 구분</label>
              <div className="flex items-center gap-6 pl-1 h-10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('foreigner_yn')} type="radio" value="N" className="w-4 h-4 accent-blue-600" />
                  <span>내국인</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('foreigner_yn')} type="radio" value="Y" className="w-4 h-4 accent-blue-600" />
                  <span>외국인</span>
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Consent Panel */}
      <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm bg-white">
        <div className="bg-gray-100 px-5 py-3 border-b border-gray-300">
          <strong className="text-gray-800 text-lg">농업 · 농촌교육 참여자 개인정보 수집 · 이용 · 제3자 제공에 관한 동의서</strong>
        </div>

        <div className="p-6">
          <div className="bg-white border border-gray-200 p-4 mb-4 text-justify text-gray-600 text-sm leading-relaxed h-[220px] overflow-y-auto font-sans">
            <div className="mb-5">
              농림수산식품교육문화정보원(이하 '농정원')에서는 농업 · 농촌교육 운영 및 농업교육포털을 통한 교육이력 관리를 위하여
              아래와 같이 개인정보를 수집 · 이용 및 제 3자에게 제공하고자 합니다. 내용을 자세히 읽으신 후 동의 여부를 결정하여 주시기 바랍니다.
            </div>
            <div className="mb-5">
              <h5 className="mb-3"><strong>[개인정보 수집 · 이용에 관한 사항(필수)]</strong></h5>
              <p className="mb-2">
                <strong>개인정보의 수집 · 이용 목적 : </strong>농업교육포털(agriedu.net)의 교육이수실적 증빙, 개인별 교육이력 관리,
                교육생 통계, 정부 · 지방자치단체 · 농정원 등 공공기관의 운영에 관한 법률 제 2조에 해당하는 공공기관 · 해당 농업교육기관 등 정보제공 및 정책자료 활용
                (사업관련 각종 연구 · 설문조사 포함)<br />
              </p>
              <p className="mb-2">
                <strong>수집 · 이용할 개인정보 항목(필수) : </strong>성명, 생년월일, 성별, 전화번호, 주민등록상 주소, E-mail, 교육 참여동기, 주 작물
              </p>
              <p>
                <strong>보유 및 이용기간 : </strong>준영구
              </p>
            </div>
            <div>
              ※ 위의 개인정보 수집 · 이용에 대한 동의를 거부할 수 있습니다. 다만, 이에 대한 동의를 하지 않을 경우에는
              불이익(교육 참여 제한 또는 교육이수실적 증빙 불가 등)이 있을 수 있습니다. (만 14세 미만인 경우에는 법정대리인이 동의)
            </div>
          </div>

          <div className="flex items-center">
            <input
              {...register('agree_check', { required: true })}
              id="agree_check"
              type="checkbox"
              className="w-5 h-5 accent-blue-600 mr-2 cursor-pointer"
            />
            <label htmlFor="agree_check" className="text-gray-700 font-medium cursor-pointer">
              위와 같이 개인정보를 수집 · 이용 · 제3자 제공하는 것에 동의합니다.
            </label>
            <span className="text-red-500 text-xs ml-2 font-bold">필수</span>
          </div>
          {errors.agree_check && <p className="text-red-500 text-sm mt-1 pl-7">개인정보 수집 이용에 동의해주세요.</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12 mb-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full md:w-[240px] px-8 py-3 bg-white border border-[#8e24aa] text-[#8e24aa] font-medium rounded hover:bg-gray-50 transition-colors text-lg"
        >
          이전 단계로
        </button>
        <button
          type="submit"
          className="w-full md:w-[240px] px-8 py-3 bg-[#8e24aa] text-white font-medium rounded hover:bg-[#7b1fa2] transition-colors text-lg"
        >
          교육신청
        </button>
      </div>

    </form>
  );
}

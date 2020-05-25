'use strict';
import $ from 'jquery';

$('.availability-toggle-button').each((i, e) => {
  const button = $(e);
  button.click(() => {
    const scheduleId = button.data('schedule-id');
    const userId = button.data('user-id');
    const candidateId = button.data('candidate-id');
    const availability = parseInt(button.data('availability'));
    // 0 → 1 → 2 → 0 → 1 → 2 と循環させたいため、 ここでは 1 を足して 3 の剰余を次の出欠の数値
    const nextAvailability = (availability + 1) % 3;
    // 出欠更新の Web API の呼び出しと、実行結果を受け取って button 要素の、 data-* 属性を更新し、ボタンのラベルを更新しています。
    $.post(`/schedules/${scheduleId}/users/${userId}/candidates/${candidateId}`,
      { availability: nextAvailability },
      (data) => {
        button.data('availability', data.availability);
        const availabilityLabels = ['欠', '？', '出'];
        button.text(availabilityLabels[data.availability]);
      });
  });
});